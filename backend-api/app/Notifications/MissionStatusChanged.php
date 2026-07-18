<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MissionStatusChanged extends Notification
{
    use Queueable;

    public $mission;
    public $message;

    public function __construct($mission, $message)
    {
        $this->mission = $mission;
        $this->message = $message;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Mise à jour mission : ' . $this->mission->title)
            ->line($this->message)
            ->action('Voir la mission', url(env('FRONTEND_URL', 'http://localhost:5173') . '/missions/' . $this->mission->id))
            ->line('Merci pour votre confiance.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'mission_id' => $this->mission->id,
            'message' => $this->message,
        ];
    }
}
