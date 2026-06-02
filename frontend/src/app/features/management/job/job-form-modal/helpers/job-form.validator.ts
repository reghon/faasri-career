import { JobFlowStatusItem, JobFormErrors, JobFormValue } from '../models/job-form.model';

export function validateJobForm(
  form: JobFormValue,
  jobFlowStatuses: JobFlowStatusItem[],
): JobFormErrors {
  const errors: JobFormErrors = {};
  if (!form.managementProfileId) {
    errors['managementProfileId'] = 'PIC wajib dipilih.';
  }
  if (!form.title.trim()) errors['title'] = 'Judul wajib diisi.';
  if (!form.slug.trim()) errors['slug'] = 'Slug wajib diisi.';
  if (!form.categoryId) errors['categoryId'] = 'Kategori wajib dipilih.';
  if (!form.employmentTypeId) errors['employmentTypeId'] = 'Tipe pekerjaan wajib dipilih.';
  if (!form.statusId) errors['statusId'] = 'Status wajib dipilih.';
  if (!form.jobLocationId) errors['jobLocationId'] = 'Lokasi kerja wajib dipilih.';
  if (!form.educationLevelId) errors['educationLevelId'] = 'Pendidikan wajib dipilih.';
  if (!form.departmentId) errors['departmentId'] = 'Departemen wajib dipilih.';
  if (!form.workModeId) errors['workModeId'] = 'Mode kerja wajib dipilih.';
  if (!form.description.trim()) errors['description'] = 'Deskripsi wajib diisi.';
  if (!form.requirements.trim()) errors['requirements'] = 'Requirements wajib diisi.';
  if (!form.responsibilities.trim()) {
    errors['responsibilities'] = 'Responsibilities wajib diisi.';
  }
  if (!form.currencyCode.trim()) errors['currencyCode'] = 'Currency wajib diisi.';
  if (!form.salaryType.trim()) errors['salaryType'] = 'Salary type wajib diisi.';
  if (!form.publishedAt) errors['publishedAt'] = 'Tanggal publish wajib diisi.';
  if (!form.closeAt) errors['closeAt'] = 'Tanggal tutup wajib diisi.';

  if (form.minSalary === null || form.minSalary < 0) {
    errors['minSalary'] = 'Minimum salary tidak valid.';
  }

  if (form.maxSalary === null || form.maxSalary < 0) {
    errors['maxSalary'] = 'Maksimum salary tidak valid.';
  }

  if (form.minSalary !== null && form.maxSalary !== null && form.maxSalary < form.minSalary) {
    errors['maxSalary'] = 'Maksimum salary tidak boleh lebih kecil dari minimum salary.';
  }

  if (form.vacancyCount < 1) {
    errors['vacancyCount'] = 'Vacancy count minimal 1.';
  }

  if (form.experienceMinYears < 0) {
    errors['experienceMinYears'] = 'Experience minimum tidak boleh negatif.';
  }

  if (form.publishedAt && form.closeAt) {
    const publishedAt = new Date(form.publishedAt).getTime();
    const closeAt = new Date(form.closeAt).getTime();

    if (closeAt <= publishedAt) {
      errors['closeAt'] = 'Tanggal tutup harus setelah tanggal publish.';
    }
  }

  if (jobFlowStatuses.length === 0) {
    errors['jobFlowStatuses'] = 'Tahapan lowongan wajib diisi.';
  }

  if (!jobFlowStatuses.some((item) => item.isDefault)) {
    errors['jobFlowStatuses'] = 'Harus ada satu tahapan default.';
  }

  if (!jobFlowStatuses.some((item) => item.isFinal)) {
    errors['jobFlowStatuses'] = 'Minimal harus ada satu tahapan final.';
  }

  return errors;
}
