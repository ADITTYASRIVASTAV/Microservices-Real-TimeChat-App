package com.Chat_App.chat_services.Controller;

import com.Chat_App.chat_services.DTO.KeyRequest;
import com.Chat_App.chat_services.DTO.KeyResponse;
import com.Chat_App.chat_services.Service.KeysService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
public class KeysController
{
    private final KeysService keysService;

    @PostMapping
    public ResponseEntity<KeyResponse> uploadKey(@RequestBody @Valid KeyRequest request,
                                                 @RequestHeader("X-User-Email") String email) {
        KeyResponse response = keysService.uploadKey(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{email}")
    public ResponseEntity<KeyResponse> getKey(@PathVariable String email) {
        KeyResponse response = keysService.getKey(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<KeyResponse>> getBulkKeys(@RequestBody List<String> emails) {
        List<KeyResponse> responses = keysService.getBulkKeys(emails);
        return ResponseEntity.ok(responses);
    }

    @PutMapping
    public ResponseEntity<KeyResponse> updateKey(@RequestBody @Valid KeyRequest request,
                                                 @RequestHeader("X-User-Email") String email) {
        KeyResponse response = keysService.updateKey(request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{email}")
    public ResponseEntity<Boolean> keyExists(@PathVariable String email) {
        return ResponseEntity.ok(keysService.keyExists(email));
    }
}
