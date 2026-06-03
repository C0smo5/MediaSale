<?php

use App\Exceptions\SmsRateLimitExceeded;
use App\Services\Verification\TwilioSmsGateway;
use Twilio\Exceptions\RestException;
use Twilio\Rest\Api\V2010\Account\MessageList;
use Twilio\Rest\Client;

test('twilio 429 is mapped to sms rate limit exception', function (): void {
    $messages = Mockery::mock(MessageList::class);
    $messages->shouldReceive('create')
        ->once()
        ->andThrow(new RestException('Rate limit', 20429, 429));

    $client = Mockery::mock(Client::class);
    $client->messages = $messages;

    $gateway = new TwilioSmsGateway($client, '+15550001111');

    expect(fn () => $gateway->send('+15552223333', 'code'))
        ->toThrow(SmsRateLimitExceeded::class);
});
