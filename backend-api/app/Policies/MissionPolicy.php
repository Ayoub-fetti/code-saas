<?php

namespace App\Policies;

use App\Models\Mission;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MissionPolicy
{
    /**
     * Determine whether the user can update the mission.
     */
    public function update(User $user, Mission $mission): Response
    {
        // Only the company that owns the mission can update it
        if ($user->role !== 'company' || !$user->company || $mission->company_id !== $user->company->id) {
            return Response::deny('You do not own this mission.');
        }

        // Only if the mission is still available (not applied, in progress, or completed)
        if ($mission->status !== 'available') {
            return Response::deny('This mission cannot be updated because it is no longer available.');
        }

        return Response::allow();
    }

    /**
     * Determine whether the user can delete the mission.
     */
    public function delete(User $user, Mission $mission): Response
    {
        // Only the company that owns the mission can delete it
        if ($user->role !== 'company' || !$user->company || $mission->company_id !== $user->company->id) {
            return Response::deny('You do not own this mission.');
        }

        // Only if the mission is still available (not applied, in progress, or completed)
        if ($mission->status !== 'available') {
            return Response::deny('This mission cannot be deleted because it is no longer available.');
        }

        return Response::allow();
    }
}