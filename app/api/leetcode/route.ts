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
    const {
      title,
      number,
      difficulty,
      category,
      description,
      approach,
      solution,
      timeComplexity,
      timeComplexityExplanation,
      spaceComplexity,
      spaceComplexityExplanation,
      tags,
      leetcodeUrl
    } = await request.json();

    const leetcodeSolution = await prisma.leetcodeSolution.create({
      data: {
        title,
        number: parseInt(number),
        difficulty,
        category,
        description,
        approach,
        solution,
        timeComplexity,
        timeComplexityExplanation: timeComplexityExplanation || null,
        spaceComplexity,
        spaceComplexityExplanation: spaceComplexityExplanation || null,
        tags,
        leetcodeUrl: leetcodeUrl || null
      },
    });

    return NextResponse.json(leetcodeSolution, { status: 201 });
  } catch (error) {
    console.error("Error creating solution:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
} 