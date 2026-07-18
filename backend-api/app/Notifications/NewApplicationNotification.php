<?php

namespace App\Notifications;

use App\Models\Mission;
use App\Models\Driver;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewApplicationNotification extends Notification
{
    use Queueable;

    public $mission;
    public $driver;

    public function __construct(Mission $mission, Driver $driver)
    {
        $this->mission = $mission;
        $this->driver = $driver;
    }

    public function via(object $notifiable): array
    {
        // Envoi par email et enregistrement en base de données pour l'interface React
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle candidature reçue')
            ->line("Un conducteur a postulé à votre mission : {$this->mission->title}.")
            ->action('Voir la candidature', url('/missions/'.$this->mission->id))
            ->line('Merci d\'utiliser notre plateforme de logistique.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'mission_id' => $this->mission->id,
            'mission_title' => $this->mission->title,
            'driver_id' => $this->driver->id,
            'message' => "Nouvelle candidature pour la mission : {$this->mission->title}",
        ];
    }
}
