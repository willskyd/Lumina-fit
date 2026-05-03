# Downloads sample videos and community images into assets/
$base = Join-Path $PSScriptRoot ".."
$assetsVideos = Join-Path $base "assets\videos"
$assetsImages = Join-Path $base "assets\images"
New-Item -ItemType Directory -Force -Path $assetsVideos | Out-Null
New-Item -ItemType Directory -Force -Path $assetsImages | Out-Null

$downloads = @(
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"; out = "$assetsVideos\ForBiggerBlazes.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"; out = "$assetsVideos\ForBiggerEscapes.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"; out = "$assetsVideos\ForBiggerJoyrides.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"; out = "$assetsVideos\TearsOfSteel.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"; out = "$assetsVideos\ElephantsDream.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"; out = "$assetsVideos\SubaruOutbackOnStreetAndDirt.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"; out = "$assetsVideos\ForBiggerFun.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"; out = "$assetsVideos\ForBiggerMeltdowns.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; out = "$assetsVideos\BigBuckBunny.mp4" },
    @{ url = "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"; out = "$assetsVideos\Sintel.mp4" },
    # Alternative public sources (fallbacks)
    @{ url = "https://media.w3.org/2010/05/sintel/trailer.mp4"; out = "$assetsVideos\sintel_alt.mp4" },
    @{ url = "https://media.w3.org/2010/05/bunny/trailer.mp4"; out = "$assetsVideos\bigbuckbunny.mp4" },
    @{ url = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"; out = "$assetsVideos\flower.mp4" },
    @{ url = "https://archive.org/download/ElephantsDream/elephants_dream_360p.mp4"; out = "$assetsVideos\elephants_dream.mp4" },
    @{ url = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"; out = "$assetsVideos\sample_bunny_1mb.mp4" },

    # Community images and avatars
    @{ url = "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\avatar_elena.jpg" },
    @{ url = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80"; out = "$assetsImages\post1.jpg" },
    @{ url = "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\avatar_marcus.jpg" },
    @{ url = "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1000&q=80"; out = "$assetsImages\post2.jpg" },
    @{ url = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\lb1.jpg" },
    @{ url = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\lb2.jpg" },
    @{ url = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\lb3.jpg" },
    @{ url = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"; out = "$assetsImages\lb4.jpg" }
)

foreach ($d in $downloads) {
    Write-Host "Downloading $($d.url) -> $($d.out)"
    try {
        Invoke-WebRequest -Uri $d.url -OutFile $d.out -UseBasicParsing -ErrorAction Stop
    } catch {
        Write-Warning "Failed to download $($d.url): $_"
    }
}

Write-Host "Downloads complete. Remember to update data files to point to local assets."