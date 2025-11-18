import { internalServerError, ok } from 'app/api/utils';
import { openai } from 'lib/openai';
import { ScoreResponse, scoreResponseSchema } from 'models/score-response';
import { Response } from 'openai/resources/responses/responses';
import { FormWithAnswersDto, getFormWithAnswers } from 'services/api/forms';
import { updateResponseScoreAndReasoning } from 'services/api/response';

export async function GET(
  req: Request,
  ctx: RouteContext<'/api/forms/[id]/score'>,
) {
  try {
    const { id } = await ctx.params;

    const formWithAnswers = await getFormWithAnswers(id);
    if (!formWithAnswers) {
      throw new Error('Form not found');
    }

    if (!formWithAnswers.responses.length) {
      return ok({ scores: {} });
    }

    const response = await openai.responses.create({
      model: 'gpt-4o',
      instructions,
      input: getScorePrompt(formWithAnswers),
    });

    const scores = parseScores(response);

    await updateResponseScoreAndReasoning(scores);

    return ok({
      scores: scores.reduce(
        (acc, score) => {
          acc[score.responseId] = score;
          return acc;
        },
        {} as Record<string, ScoreResponse>,
      ),
    });
  } catch (err) {
    console.error(err);
    return internalServerError();
  }
}

function parseScores(response: Response): ScoreResponse[] {
  try {
    var scores;

    const jsonMatch = response.output_text.match(/```json([\s\S]*?)```/);
    if (jsonMatch) {
      scores = JSON.parse(jsonMatch[1]);
    } else {
      scores = JSON.parse(response.output_text);
    }

    const parsedScores = scoreResponseSchema.array().parse(scores);

    return parsedScores;
  } catch (err) {
    console.log(response);
    console.error(err);
    return [];
  }
}

const instructions = `You are a helpful assistant whose single task is to score candidate responses against a job posting.
   Follow these rules exactly:
   1) Use ONLY the job data provided in the prompt (title, location, description, responses). Do NOT use outside knowledge.
   2) Produce a single JSON value and nothing else (no commentary, no explanation outside the JSON).
   3) The JSON must be an array of objects. Each object must have exactly these keys:
      - responseId (string)
      - score (number between 0.00 and 1.00 inclusive, round to 2 decimal places)
      - reasoning (string, concise; max ~120 words)
   4) Be consistent and deterministic: apply the same rubric to every response.
   5) Use the rubric below when scoring. If a criterion is not present in the response, score that criterion 0.
      - Relevance to role responsibilities: 50%
      - Required skills/technologies mentioned: 30%
      - Relevant experience / seniority match: 20%
   6) Do not invent facts about candidates; only evaluate what's in each response.
   7) The output array must include one object per input response, in the same order.
  `;

function getScorePrompt(formWithAnswers: FormWithAnswersDto) {
  const jobData = {
    title: formWithAnswers.title,
    location: formWithAnswers.location,
    description: formWithAnswers.description,
    responses: formWithAnswers.responses,
  };

  return `
You will be given a JSON object "data". Use ONLY that object to score each candidate response.
Return EXACTLY one JSON array and nothing else.

Data:
${JSON.stringify(jobData)}

Rubric (apply deterministically):
- Relevance to role responsibilities: 50%
- Required skills / technologies: 30%
- Relevant experience / seniority level: 20%

Scoring rules (must follow exactly):
- score must be a number between 0.00 and 1.00 inclusive.
- Round scores to 2 decimal places (e.g. 0.00, 0.75, 1.00).
- reasoning should be concise (max ~120 words), and cite which rubric items affected the score (e.g. "Relevance: 0.40; Skills: 0.20; Experience: 0.10").
- Do NOT include any fields other than responseId, score, reasoning.
- Output one object per input response, in the same order as provided in data.responses.

Example output (for format only):
[
  {
    "responseId": "resp-1",
    "score": 0.85,
    "reasoning": "Relevance: 0.45 (addresses main responsibilities); Skills: 0.27 (mentions primary tech); Experience: 0.13 (similar years)."
  },
  {
    "responseId": "resp-2",
    "score": 0.10,
    "reasoning": "Relevance: 0.05 (only generic interest); Skills: 0.03 (no relevant tech); Experience: 0.02 (no comparable background)."
  }
]

Now evaluate the provided data and return the JSON array as described.
It's critical that you follow the output format exactly.
Don't add any commentary or explanation outside the JSON array.
`;
}
