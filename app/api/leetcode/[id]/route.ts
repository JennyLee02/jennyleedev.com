import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solution = await prisma.leetcodeSolution.findUnique({
      where: { id },
    });

    if (!solution) {
      return NextResponse.json(
        { error: "Solution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(solution);
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json(
      { error: "Failed to fetch solution" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.leetcodeSolution.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Solution deleted successfully" });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json(
      { error: "Failed to delete solution" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Convert tags string to array if it's a string
    const tagsArray = typeof tags === 'string' 
      ? tags.split(',').map((tag: string) => tag.trim()) 
      : tags;

    const updatedSolution = await prisma.leetcodeSolution.update({
      where: { id },
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

    return NextResponse.json(updatedSolution);
  } catch (error) {
    console.error("Error updating solution:", error);
    return NextResponse.json(
      { error: "Failed to update solution" },
      { status: 500 }
    );
  }
} 