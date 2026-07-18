<?php

namespace App\Policies;

use App\Models\Driver;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DriverPolicy
{
    /**
     * Determine whether the user can apply to a mission.
     */
    public function apply(User $user, Driver $driver): Response
    {
        return ($driver->is_complete && $driver->is_admin_verified)
            ? Response::allow()
            : Response::deny('Complétez votre profil à 100% et attendez la validation administrative pour postuler.');
    }
}
