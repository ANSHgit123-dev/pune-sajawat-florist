import os
from PIL import Image, ImageDraw

def make_logo_transparent(input_path, output_path):
    print(f"Loading image from {input_path}")
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    # Let's inspect the pixels to find the circular emblem.
    # The circular emblem is white (R > 240, G > 240, B > 240).
    # The checkered background consists of alternating gray and light-gray squares.
    # We can detect the circle boundary. Let's scan from the center outwards to find the radius
    # of the white circle, or scan row-by-row.
    # Alternatively, let's find the circle center (cx, cy) and radius r by looking for pixels
    # that are white/green.
    
    # Let's scan for the circle bounds.
    # Find leftmost, rightmost, topmost, bottommost pixels that belong to the white circle.
    # A pixel is in the circle if it's white (R > 240, G > 240, B > 240) or green/pink inside.
    # Actually, the background checkered pixels have gray values (typically R, G, B are equal or close, and not white).
    # Let's check: checkered squares are usually dark gray (~#3c3c3c) and light gray (~#5c5c5c) or similar.
    # Let's define a helper to check if a pixel is background.
    # Background pixels are checkerboard. Let's see if we can identify them:
    # If the pixel color is NOT white-ish (i.e. not R > 220, G > 220, B > 220) and not part of the logo green/pink.
    # Actually, a circular mask is extremely robust if the circle is centered.
    # Let's find the circle by scanning horizontally and vertically.
    
    # Find the top of the circle:
    top_y = None
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            # White circle color: very bright
            if r > 240 and g > 240 and b > 240:
                top_y = y
                break
        if top_y is not None:
            break
            
    # Find the bottom of the circle:
    bottom_y = None
    for y in range(height - 1, -1, -1):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if r > 240 and g > 240 and b > 240:
                bottom_y = y
                break
        if bottom_y is not None:
            break
            
    # Find the left of the circle:
    left_x = None
    for x in range(width):
        for y in range(height):
            r, g, b, a = img.getpixel((x, y))
            if r > 240 and g > 240 and b > 240:
                left_x = x
                break
        if left_x is not None:
            break
            
    # Find the right of the circle:
    right_x = None
    for x in range(width - 1, -1, -1):
        for y in range(height):
            r, g, b, a = img.getpixel((x, y))
            if r > 240 and g > 240 and b > 240:
                right_x = x
                break
        if right_x is not None:
            break

    print(f"Detected circle bounds: Left={left_x}, Right={right_x}, Top={top_y}, Bottom={bottom_y}")
    
    if left_x is None or right_x is None or top_y is None or bottom_y is None:
        print("Failed to detect circle bounds automatically.")
        return False
        
    # Calculate center and radius
    cx = (left_x + right_x) / 2.0
    cy = (top_y + bottom_y) / 2.0
    rx = (right_x - left_x) / 2.0
    ry = (bottom_y - top_y) / 2.0
    r = (rx + ry) / 2.0
    
    print(f"Center: ({cx}, {cy}), Radius: {r}")
    
    # Create a mask image
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # Draw a filled circle with white (255) on the mask.
    # We can add a small padding (e.g. +1 pixel) to make sure we don't clip the border.
    pad = 1.5
    draw.ellipse([cx - r - pad, cy - r - pad, cx + r + pad, cy + r + pad], fill=255)
    
    # Put the mask into the alpha channel
    datas = img.getdata()
    new_data = []
    mask_data = mask.getdata()
    
    for i, item in enumerate(datas):
        # If the mask is 0 (outside circle), make it transparent
        if mask_data[i] == 0:
            new_data.append((0, 0, 0, 0)) # transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop the image to the circle bounds to make it clean
    # Let's crop with a small margin around the circle
    margin = 5
    crop_box = (
        max(0, int(cx - r - margin)),
        max(0, int(cy - r - margin)),
        min(width, int(cx + r + margin)),
        min(height, int(cy + r + margin))
    )
    cropped_img = img.crop(crop_box)
    
    cropped_img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")
    return True

if __name__ == "__main__":
    input_img = "c:/Users/LAXMAN/antigravity/Pune-Sajawat-Florist-final-project/public/logo.jpg"
    output_img = "c:/Users/LAXMAN/antigravity/Pune-Sajawat-Florist-final-project/public/logo.png"
    make_logo_transparent(input_img, output_img)
