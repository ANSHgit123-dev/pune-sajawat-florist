from PIL import Image

def find_colors():
    img = Image.open("c:/Users/LAXMAN/antigravity/Pune-Sajawat-Florist-final-project/public/logo.png")
    # Convert to RGBA
    img = img.convert("RGBA")
    width, height = img.size
    
    # We want to find common colors. Let's count them
    colors = {}
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a > 100: # not transparent
                # Skip pure white
                if r > 240 and g > 240 and b > 240:
                    continue
                color = (r, g, b)
                colors[color] = colors.get(color, 0) + 1
                
    sorted_colors = sorted(colors.items(), key=lambda x: x[1], reverse=True)
    print("Top colors:")
    for col, count in sorted_colors[:15]:
        hex_color = '#{:02x}{:02x}{:02x}'.format(*col)
        print(f"Color: {col} -> Hex: {hex_color} -> Count: {count}")

if __name__ == "__main__":
    find_colors()
