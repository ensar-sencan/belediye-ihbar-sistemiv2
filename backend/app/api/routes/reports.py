from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/reports/")
async def create_report(report: ReportCreate):
    # Implementation here
    pass

@router.get("/reports/")
async def list_reports(skip: int = 0, limit: int = 10):
    # Implementation here
    pass

@router.get("/reports/{report_id}")
async def get_report(report_id: int):
    # Implementation here
    pass

@router.put("/reports/{report_id}")
async def update_report(report_id: int, report: ReportUpdate):
    # Implementation here
    pass

@router.post("/reports/{report_id}/vote")
async def vote_report(report_id: int):
    # Implementation here
    pass

@router.post("/reports/{report_id}/unvote")
async def unvote_report(report_id: int):
    # Implementation here
    pass

@router.delete("/reports/{report_id}")
async def delete_report(report_id: int):
    # Implementation here
    pass
