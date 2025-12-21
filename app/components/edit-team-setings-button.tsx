import { Cog8ToothIcon } from '@heroicons/react/24/solid';

export function EditTeamSettingsButton() {
  return (
    <div className="tooltip" data-tip="Edit team settings">
      <button className="btn btn-neutral btn-circle">
        <Cog8ToothIcon className="size-6" />
      </button>
    </div>
  );
}
