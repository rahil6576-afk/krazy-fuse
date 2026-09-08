$destZip = 'c:\Users\RAHIL SUTARIA\OneDrive\Desktop\Swing_Legends_Under500MB.zip'
if (Test-Path $destZip) { Remove-Item $destZip -Force }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipStream = [System.IO.File]::Open($destZip, [System.IO.FileMode]::CreateNew)
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, [System.IO.Compression.ZipArchiveMode]::Create)

$rootDir = 'c:\Users\RAHIL SUTARIA\OneDrive\Desktop\Swing legends'
$files = Get-ChildItem $rootDir -Recurse -File -Force | Where-Object {
    $_.FullName -notmatch '\\node_modules(\\|$)' -and
    $_.Name -ne 'Downtown City MegaKit[Standard].zip' -and
    $_.Extension -ne '.zip'
}

$count = 0
foreach ($file in $files) {
    $relPath = $file.FullName.Substring($rootDir.Length).TrimStart('\', '/')
    $entry = $archive.CreateEntry($relPath, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    $fileStream.CopyTo($entryStream)
    $fileStream.Dispose()
    $entryStream.Dispose()
    $count++
}

$archive.Dispose()
$zipStream.Dispose()

$result = Get-Item $destZip
[PSCustomObject]@{
    ZipPath = $result.FullName
    FilesArchived = $count
    SizeBytes = $result.Length
    SizeMB = [math]::Round($result.Length / 1MB, 2)
} | Format-List
