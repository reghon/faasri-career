import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GUIDE_SECTIONS, GuideSection } from './guide.config';
import { AuthorizationService } from '../../../domain/authorization/authorization.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document.html',
})
export class Document {
  private readonly auth = inject(AuthorizationService);
  readonly searchQuery = signal('');
  readonly tocOpen = signal(false);
  readonly isExporting = signal(false);

  readonly visibleSections = computed(() => {
    return GUIDE_SECTIONS.map((section) => {
      if (section.permission && !this.auth.has(section.permission)) return null;

      const visibleChildren = section.children.filter(
        (child) => !child.permission || this.auth.has(child.permission),
      );

      if (visibleChildren.length === 0) return null;
      return { ...section, children: visibleChildren };
    }).filter((s): s is GuideSection => s !== null);
  });

  readonly filteredSections = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.visibleSections();

    return this.visibleSections()
      .map((section) => {
        const matchesTitle = section.title.toLowerCase().includes(query);
        const matchedChildren = section.children.filter(
          (child) =>
            child.title.toLowerCase().includes(query) ||
            child.content.toLowerCase().includes(query) ||
            (child.bullets ?? []).some((b) => b.toLowerCase().includes(query)),
        );
        if (matchesTitle) return section;
        if (matchedChildren.length > 0) return { ...section, children: matchedChildren };
        return null;
      })
      .filter((s): s is GuideSection => s !== null);
  });

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.tocOpen.set(false);
    }
  }

  toggleToc(): void {
    this.tocOpen.update((v) => !v);
  }

  exportPdf(): void {
    this.isExporting.set(true);
    const element = document.getElementById('doc-content');
    if (!element) {
      this.isExporting.set(false);
      return;
    }

    import('html2pdf.js').then((module) => {
      const html2pdf = (module as any).default ?? module;
      html2pdf()
        .from(element)
        .set({
          margin: [15, 15, 15, 15],
          filename: 'Faasri_ATS_User_Guide.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            onclone: (clonedDoc: any) => {
              const s = clonedDoc.createElement('style');
              s.textContent = `
                *, *::before, *::after {
                  color: #1f2937 !important;
                  border-color: #e5e7eb !important;
                  background-color: transparent !important;
                  box-shadow: none !important;
                }
                #doc-content { background-color: #fff !important; }
                h1, h2, h3 { color: #111827 !important; }
                p { color: #374151 !important; }
              `;
              clonedDoc.head.appendChild(s);
            },
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        })
        .save()
        .then(() => this.isExporting.set(false))
        .catch((e: any) => { console.error('html2pdf error:', e); this.isExporting.set(false); });
    }).catch((e: any) => { console.error('import error:', e); this.isExporting.set(false); });
  }
}
