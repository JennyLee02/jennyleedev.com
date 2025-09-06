import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const solutions = await prisma.leetcodeSolution.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      number,
      difficulty,
      category,
      description,
      examples,
      constraints,
      followUp,
      solution,
      pythonCode,
      cppCode,
      approach,
      timeComplexity,
      timeComplexityExplanation,
      spaceComplexity,
      spaceComplexityExplanation,
      tags,
      leetcodeUrl
    } = body;

    // Convert tags string to array
    const tagsArray = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

    const newSolution = await prisma.leetcodeSolution.create({
      data: {
        title,
        number: parseInt(number),
        difficulty,
        category,
        description,
        ...(examples && { examples }),
        ...(constraints && { constraints }),
        ...(followUp && { followUp }),
        solution,
        pythonCode,
        cppCode,
        approach,
        timeComplexity,
        timeComplexityExplanation,
        spaceComplexity,
        spaceComplexityExplanation,
        tags: tagsArray,
        leetcodeUrl
      } as any,
    });

    return NextResponse.json(newSolution, { status: 201 });
  } catch (error) {
    console.error("Error creating solution:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
} 