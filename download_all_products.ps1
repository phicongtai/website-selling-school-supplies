# Script to download product images for School Supplies
$items = @(
    @{ id = 8; query = "fineliner pen drawing" },
    @{ id = 9; query = "gel pen writing" },
    @{ id = 10; query = "fountain pen calligraphy" },
    @{ id = 11; query = "pencil ergonomic children" },
    @{ id = 12; query = "ballpoint pen writing" },
    @{ id = 13; query = "whiteboard marker felt pen" },
    @{ id = 14; query = "brush pen calligraphy" },
    @{ id = 15; query = "colored gel pens desk" },
    @{ id = 16; query = "wooden pencils sharpened" },
    @{ id = 17; query = "metal ballpoint pen luxury" },
    @{ id = 18; query = "highlighter marker pens pastel" },
    @{ id = 19; query = "mechanical pencil graphite lead" },
    @{ id = 20; query = "fountain pen ink bottle" },

    @{ id = 21; query = "leather ring binder journal" },
    @{ id = 22; query = "lined paper school notebook" },
    @{ id = 23; query = "spiral notebook grid paper" },
    @{ id = 24; query = "school exercise books stack" },
    @{ id = 25; query = "bullet journal dotted pages" },
    @{ id = 26; query = "loose leaf paper sheets" },
    @{ id = 27; query = "personal organizer daily planner" },
    @{ id = 28; query = "sticky notes post it yellow" },
    @{ id = 29; query = "small pocket notebook" },
    @{ id = 30; query = "open notebook graph paper" },
    @{ id = 31; query = "calligraphy lettering book" },
    @{ id = 32; query = "colorful sticky note pads" },
    @{ id = 33; query = "vintage bound journal book" },
    @{ id = 34; query = "open blank sketchbook" },
    @{ id = 35; query = "flashcards study notes" },
    @{ id = 36; query = "clear binder journal cover" },
    @{ id = 37; query = "open lined notebook writing" },
    @{ id = 38; query = "exam papers test sheets" },
    @{ id = 39; query = "executive leather folder portfolio" },
    @{ id = 40; query = "colored sticky tabs bookmark" },

    @{ id = 41; query = "student school backpack" },
    @{ id = 42; query = "fashion student backpack" },
    @{ id = 43; query = "lightweight school bag" },
    @{ id = 44; query = "kids school satchel backpack" },
    @{ id = 45; query = "laptop travel backpack" },
    @{ id = 46; query = "canvas tote bag books" },
    @{ id = 47; query = "commuter backpack black" },
    @{ id = 48; query = "classic leather briefcase bag" },
    @{ id = 49; query = "small casual backpack" },
    @{ id = 50; query = "crossbody messenger shoulder bag" },
    @{ id = 51; query = "briefcase document folder bag" },
    @{ id = 52; query = "travel carry on backpack" },
    @{ id = 53; query = "modern minimalist backpack" },
    @{ id = 54; query = "water bottle insulated holder" },
    @{ id = 55; query = "rolling luggage backpack trolley" },
    @{ id = 56; query = "children colorful backpack" },
    @{ id = 57; query = "fabric shoulder tote bag" },
    @{ id = 58; query = "sports duffel gym backpack" },
    @{ id = 59; query = "transparent vinyl bag" },
    @{ id = 60; query = "expanding accordion file folder" },

    @{ id = 61; query = "zippered pencil pouch canvas" },
    @{ id = 62; query = "modern study desk lamp" },
    @{ id = 63; query = "clear pencil case stationery" },
    @{ id = 64; query = "wooden table desk organizer shelf" },
    @{ id = 65; query = "desk pen pencil holder pot" },
    @{ id = 66; query = "vintage tin pencil box" },
    @{ id = 67; query = "ergonomic office desk chair" },
    @{ id = 68; query = "adjustable led reading desk lamp" },
    @{ id = 69; query = "desktop drawer cabinet organizer" },
    @{ id = 70; query = "wooden book reading rest stand" },
    @{ id = 71; query = "plush cute pencil case" },
    @{ id = 72; query = "desk mat blotter mousepad" },
    @{ id = 73; query = "office paper document desk tray" },
    @{ id = 74; query = "wooden monitor laptop stand desk" },
    @{ id = 75; query = "pencil box organizer stationery" },
    @{ id = 76; query = "cable management clips desk" },
    @{ id = 77; query = "cork bulletin memo pin board" },
    @{ id = 78; query = "portable folding laptop desk" },
    @{ id = 79; query = "hanging desk side organizer" },
    @{ id = 80; query = "wooden pen pencil pot" },

    @{ id = 81; query = "watercolor paint tin box palette" },
    @{ id = 82; query = "dual tip art marker pens" },
    @{ id = 83; query = "coloring pencils tin set" },
    @{ id = 84; query = "oil pastels crayons colorful" },
    @{ id = 85; query = "acrylic paint tubes artist" },
    @{ id = 86; query = "artist watercolor paint brushes" },
    @{ id = 87; query = "watercolor paper pad artist" },
    @{ id = 88; query = "folding art paint palette" },
    @{ id = 89; query = "colored drawing pencils set" },
    @{ id = 90; query = "art kneaded rubber eraser" },
    @{ id = 91; query = "artist watercolor pan set" },
    @{ id = 92; query = "craft hobby cutting knife" },
    @{ id = 93; query = "drawing ruler drafting tools" },
    @{ id = 94; query = "textured drawing paper art" },
    @{ id = 95; query = "drafting compass geometry tool" },
    @{ id = 96; query = "drawing white highlight pen" },
    @{ id = 97; query = "modeling clay colorful plasticine" },
    @{ id = 98; query = "graphite sketching pencils drawing" },
    @{ id = 99; query = "wooden desktop studio artist easel" },
    @{ id = 100; query = "school safety craft scissors" }
)

$targetDir = "assets\img"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
}

function Get-ImageThumbUrl($q) {
    try {
        $searchQuery = "$q filetype:bitmap"
        $encoded = [uri]::EscapeDataString($searchQuery)
        $apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=$encoded&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=500"
        $res = Invoke-RestMethod -Uri $apiUrl -UserAgent "SchoolSuppliesEduWebsite/1.0" -TimeoutSec 10
        if ($res.query -and $res.query.pages) {
            foreach ($p in $res.query.pages.PSObject.Properties) {
                $t = $p.Value.imageinfo[0].thumburl
                if ($t -and ($t -match '\.jpe?g|\.png')) {
                    return $t
                }
            }
        }
    } catch {
        # ignore error and return null
    }
    return $null
}

$fallbackUrl = "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/A_pen_writing_%22Example%22.jpg/500px-A_pen_writing_%22Example%22.jpg"

$successCount = 0
$failCount = 0

foreach ($it in $items) {
    $outFile = Join-Path $targetDir "product-$($it.id).jpg"
    
    # Skip if already exists and size > 5KB
    if (Test-Path $outFile) {
        $len = (Get-Item $outFile).Length
        if ($len -gt 5000) {
            Write-Host "Product $($it.id) already exists ($len bytes). Skipping."
            $successCount++
            continue
        }
    }

    $thumb = Get-ImageThumbUrl $it.query
    if (-not $thumb) {
        # retry with broader query
        $broad = ($it.query -split ' ')[0] + " stationery"
        $thumb = Get-ImageThumbUrl $broad
    }

    if (-not $thumb) {
        $thumb = $fallbackUrl
    }

    Write-Host "[$($it.id)/100] Fetching for $($it.query)..."
    try {
        curl.exe -L -s -o $outFile -A "SchoolSuppliesEduWebsite/1.0" $thumb
        $fi = Get-Item $outFile
        if ($fi.Length -gt 3000) {
            $successCount++
            Write-Host " -> OK ($($fi.Length) bytes)"
        } else {
            Write-Host " -> Small file ($($fi.Length) bytes), falling back..."
            curl.exe -L -s -o $outFile -A "SchoolSuppliesEduWebsite/1.0" $fallbackUrl
            $successCount++
        }
    } catch {
        Write-Host " -> FAILED: $_"
        $failCount++
    }

    Start-Sleep -Milliseconds 150
}

Write-Host "Completed: $successCount succeeded, $failCount failed."

