<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractiveWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Mission;
use App\Models\Driver;

class NewApplication implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mission;
    public $driver;

    /**
     * Create a new event instance.
     */
    public function __construct(Mission $mission, Driver $driver)
    {
        $this->mission = $mission;
        $this->driver = $driver;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('company.'.$this->mission->company_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'new-application';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'mission_id' => $this->mission->id,
            'mission_title' => $this->mission->title,
            'driver_id' => $this->driver->id,
            'driver_name' => $this->driver->user->name,
            'message' => 'Nouvelle candidature reçue pour la mission : '.$this->mission->title,
        ];
    }
}