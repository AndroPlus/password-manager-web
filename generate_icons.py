import os
from PIL import Image, ImageDraw

def create_master_icon(filename="master_icon.png", size=(1024, 1024)):
    # Create a new image with a blue background
    # Color #0D47A1 is a deep blue
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw a rounded rectangle or circle for background
    # Android adaptive icons usually expect a background layer and foreground layer, 
    # but for legacy/simple launcher icons, a shaped icon is often used.
    # We'll make a circular icon for simplicity and broader compatibility as a "legacy" icon
    # or a full bleed square if we were doing adaptive. 
    # Let's do a simple filled circle background.
    
    bg_color = (13, 71, 161, 255) # #0D47A1
    padding = 50
    draw.ellipse([padding, padding, size[0]-padding, size[1]-padding], fill=bg_color)
    
    # Draw a Lock Icon in the center
    # Lock body
    lock_width = size[0] // 2.5
    lock_height = size[1] // 3
    center_x = size[0] // 2
    center_y = size[1] // 2
    
    body_left = center_x - (lock_width // 2)
    body_top = center_y - (lock_height // 4) 
    body_right = body_left + lock_width
    body_bottom = body_top + lock_height
    
    draw.rounded_rectangle([body_left, body_top, body_right, body_bottom], radius=40, fill="white")
    
    # Lock Shackle
    shackle_width = lock_width * 0.7
    shackle_height = lock_height * 0.8
    shackle_left = center_x - (shackle_width // 2)
    shackle_top = body_top - (shackle_height // 1.5)
    shackle_right = shackle_left + shackle_width
    shackle_bottom = body_top
    
    # Draw shackle arches (strokes)
    # We can simulate this by drawing a thick stroked arc or just two concentric shapes.
    # Simple way: Draw filled, then cut out center? No, easier to draw strokes if PIL supports it well, 
    # but strictly PIL `arc` is thin.
    # Let's draw a thick line.
    
    thickness = 60
    # Left leg
    draw.rectangle([shackle_left, shackle_top + (shackle_width//2), shackle_left + thickness, shackle_bottom], fill="white")
    # Right leg
    draw.rectangle([shackle_right - thickness, shackle_top + (shackle_width//2), shackle_right, shackle_bottom], fill="white")
    
    # Top arc
    # Bounding box for the arc
    arc_box = [shackle_left, shackle_top, shackle_right, shackle_top + shackle_width]
    # Draw semi-circle? 
    # Actually, simpler to just draw a white circle and a smaller blue circle inside? 
    # But that messes up background.
    # Let's stick to the body (which is most visible) and a simple keyhole maybe?
    
    # Let's just refine the lock body with a keyhole for simplicity and clarity at small sizes.
    keyhole_radius = 40
    keyhole_y = (body_top + body_bottom) // 2
    draw.ellipse([center_x - keyhole_radius, keyhole_y - keyhole_radius*2, center_x + keyhole_radius, keyhole_y], fill=bg_color)
    draw.polygon([(center_x, keyhole_y), (center_x - keyhole_radius, keyhole_y + 100), (center_x + keyhole_radius, keyhole_y + 100)], fill=bg_color)

    # Re-drawing the arch more simply as a solid block behind or just simplify design to just the textual/symbolic rep?
    # Let's try to draw the arch again properly.
    # Arc using concentric circles
    
    # Outer arch
    p = shackle_left
    q = shackle_top
    r = shackle_right - 1 # fix off-by-one
    s = shackle_top + shackle_width
    
    # We can effectively draw a thick arc by drawing a circle stroke?
    # width argument is available in newer PIL versions for ellipse/arc.
    try:
        draw.arc([shackle_left, shackle_top, shackle_right, shackle_top + shackle_width], start=180, end=0, fill="white", width=thickness)
    except:
        # Fallback for older PIL
        pass

    img.save(filename)
    print(f"Master icon saved to {filename}")
    return img

def resize_icons(master_icon_path, base_res_dir):
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    
    if not os.path.exists(master_icon_path):
        print("Master icon not found!")
        return

    img = Image.open(master_icon_path)
    
    for folder, size in sizes.items():
        target_dir = os.path.join(base_res_dir, folder)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
            
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        target_path = os.path.join(target_dir, "ic_launcher.png")
        resized_img.save(target_path)
        print(f"Saved {size}x{size} icon to {target_path}")

        # Also save round version if needed (usually just same icon or processed, let's just duplicate for now as placeholder)
        target_path_round = os.path.join(target_dir, "ic_launcher_round.png")
        resized_img.save(target_path_round)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    master_path = os.path.join(current_dir, "master_icon.png")
    
    # 1. Generate Master
    create_master_icon(master_path)
    
    # 2. Resize and Distribute
    # Target: C:\Users\rames\AndroidStudioProjects\PasswordmanagerNew\app\src\main\res
    # We need to use the path provided in user's workspace
    target_res_path = r"C:\Users\rames\AndroidStudioProjects\PasswordmanagerNew\app\src\main\res"
    
    resize_icons(master_path, target_res_path)
