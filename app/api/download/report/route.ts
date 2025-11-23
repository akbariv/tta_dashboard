import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // absolute path on developer machine (as requested)
    const filePath = "C:\\Users\\ASUS Zenbook\\Documents\\testing download excel.xlsx";

    // ensure file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const data = await fs.promises.readFile(filePath);

    const fileName = path.basename(filePath);

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    return new NextResponse(String(err), { status: 500 });
  }
}
