import { NextRequest } from 'next/server';
import { badRequest, internalServerError, ok, unauthorized } from '../utils';
import { UpdateTeam, updateTeamSchema } from 'models/team';
import { updateTeam, UpdateTeamDto } from 'services/api/team';
import { auth0 } from 'lib/auth0';
import { uploadFile } from 'utils/utils.server';

export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/team'>) {
  try {
    const session = await auth0.getSession();
    if (!session?.user.email) {
      return unauthorized();
    }
    const formData = await req.formData();

    /**
     * Convert formData values to regular object
     */
    const data: Record<string, any> = {
      coverImage: formData.get('coverImage'),
    };

    /**
     * Validate the regular object
     */
    const updateTeamForm = updateTeamSchema.safeParse(data);
    if (updateTeamForm.error) {
      return badRequest();
    }

    /**
     * Upload properties that contain file values to vercel cloud
     */
    const updateTeamDto = await mapUpdateTeamDto(updateTeamForm.data);

    /**
     * Send update request to backend
     */
    const updated = await updateTeam(session, updateTeamDto);

    if (!updated) {
      throw new Error('Could not update team');
    }

    return ok();
  } catch (err) {
    console.log(err);
    return internalServerError();
  }
}

async function mapUpdateTeamDto(form: UpdateTeam): Promise<UpdateTeamDto> {
  const updateTeamDto: UpdateTeamDto = {};

  updateTeamDto.coverImage = form.coverImage
    ? await uploadFile(form.coverImage)
    : null;

  return updateTeamDto;
}
