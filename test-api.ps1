# Test Register
Write-Host "=== Testing Register ===" -ForegroundColor Cyan
$registerBody = @{
    email = "test@example.com"
    password = "Test123!"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Register Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
    
    # Save tokens
    $accessToken = $response.accessToken
    $refreshToken = $response.refreshToken
    
    Write-Host "`n=== Testing Login ===" -ForegroundColor Cyan
    $loginBody = @{
        email = "test@example.com"
        password = "Test123!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login Success!" -ForegroundColor Green
    Write-Host ($loginResponse | ConvertTo-Json -Depth 10)
    
    # Use new token
    $accessToken = $loginResponse.accessToken
    
    Write-Host "`n=== Testing Get Profile (Protected) ===" -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/profile" -Method Get -Headers $headers
    Write-Host "✅ Get Profile Success!" -ForegroundColor Green
    Write-Host ($profileResponse | ConvertTo-Json -Depth 10)
    
    Write-Host "`n=== Testing Logout ===" -ForegroundColor Cyan
    $logoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/logout" -Method Post -Headers $headers
    Write-Host "✅ Logout Success!" -ForegroundColor Green
    Write-Host ($logoutResponse | ConvertTo-Json -Depth 10)
    
    Write-Host "`n✅ ALL TESTS PASSED!" -ForegroundColor Green
    
} catch {
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ Error ($statusCode):" -ForegroundColor Red
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
