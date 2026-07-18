<?php

namespace App\Events;

use App\Models\Bid;
use App\Models\Driver;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ApplicationAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Bid $bid)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('driver.'.$this->bid->driver->user_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'application-accepted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'mission_id' => $this->bid->mission_id,
            'mission_title' => $this->bid->mission->title,
            'driver_id' => $this->bid->driver->id,
            'driver_name' => $this->bid->driver->user->name,
            'message' => 'Votre candidature pour la mission « '.$this->bid->mission->title.' » a été acceptée !',
            'accepted_at' => now()->toDateTimeString(),
        ];
    }
}