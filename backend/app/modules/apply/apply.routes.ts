import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { uploadApplicationCv } from "../../middlewares/upload.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { applyController } from "./apply.controllers";
import { applyJobParamsSchema, applyQuerySchema, createApplyBodySchema, updateApplyStatusBodySchema, applyParamsSchema, applyDetailParamsSchema } from "./apply.schemas";

const router: Router = Router();

router.use(authenticate);
router.get("/me", asyncHandler(applyController.getMine));
router.get("/applicant/:id", validate({ params: applyParamsSchema }), asyncHandler(applyController.getApplyListByApplicantProfileId));
router.get(
  "/applicant/detail/:applicantProfileId/:applyId",
  validate({
    params: applyDetailParamsSchema,
  }),
  asyncHandler(applyController.getApplyDetailById),
);
router.get("/me/detail/:id", validate({ params: applyParamsSchema }), asyncHandler(applyController.getMineDetailById));
router.post(
  "/",
  uploadApplicationCv.single("cv"),
  (req, _res, next) => { if (req.body.data) req.body = JSON.parse(req.body.data); next(); },
  validate({ body: createApplyBodySchema }),
  asyncHandler(applyController.create),
);
router.get("/", validate({ query: applyQuerySchema }), asyncHandler(applyController.getAll));
router.get("/job/:jobId", validate({ params: applyJobParamsSchema }), asyncHandler(applyController.getByJobId));
router.patch(
  "/:id/status",
  validate({
    params: applyParamsSchema,
    body: updateApplyStatusBodySchema,
  }),
  asyncHandler(applyController.updateStatus),
);
router.get("/check/:jobId", validate({ params: applyJobParamsSchema }), asyncHandler(applyController.hasApplied));

export default router;
