<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RegistrationOtpNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $code,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Codigo de verificacao - '.config('app.name'))
            ->line('Use o codigo abaixo para confirmar seu e-mail no cadastro.')
            ->line('Codigo: '.$this->code)
            ->line('Este codigo expira em '.config('registration.otp.expires_minutes').' minutos.');
    }
}
