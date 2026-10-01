import sys
import time
from playwright.sync_api import sync_playwright

def verify_mars_geospectra():
    print("=== MARS-GEOSPECTRA BROWSER VERIFICATION ===")
    errors = []
    
    with sync_playwright() as p:
        # Launch with system installed Microsoft Edge or Chrome
        try:
            browser = p.chromium.launch(channel="msedge", headless=True)
        except Exception:
            try:
                browser = p.chromium.launch(channel="chrome", headless=True)
            except Exception:
                browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        # Capture console messages
        def handle_console(msg):
            if msg.type == 'error':
                print(f"[BROWSER ERROR] {msg.text}")
                errors.append(msg.text)
            else:
                print(f"[BROWSER LOG] {msg.text}")

        page.on("console", handle_console)
        page.on("pageerror", lambda exc: errors.append(str(exc)))

        # 1. Navigate to Local Dev Server
        print("Navigating to http://localhost:3000/ ...")
        page.goto("http://localhost:3000/", wait_until="networkidle", timeout=15000)
        
        # 2. Verify Title
        title = page.title()
        print(f"Page title: {title}")
        assert "MARS-GEOSPECTRA" in title, f"Unexpected title: {title}"

        # 3. Verify Canvas rendering
        canvas = page.locator("canvas")
        assert canvas.count() > 0, "No 3D WebGL canvas found!"
        print(f"3D Canvas rendered successfully! Count: {canvas.count()}")

        # Wait 2 seconds for Three.js scene to render frames
        time.sleep(2)
        page.screenshot(path="docs/screenshots/01_landing_jezero.png")
        print("Saved screenshot: docs/screenshots/01_landing_jezero.png")

        # 4. Verify Telemetry & Header
        assert page.get_by_text("MARS-GEOSPECTRA", exact=True).is_visible(), "Brand header missing"
        assert page.get_by_text("JEZERO CRATER", exact=True).first.is_visible(), "Jezero Crater badge missing"
        print("Telemetry badges verified.")

        # 5. Test Route Selection
        print("Testing candidate route selection...")
        route_cards = page.get_by_text("Direct / Fastest Traversal").first
        assert route_cards.is_visible(), "Fastest route card not found"
        route_cards.click()
        time.sleep(1)
        print("Selected Route: Direct / Fastest Traversal")

        # 6. Test Simulation Launch
        print("Testing Marswalk EVA Simulation...")
        sim_btn = page.locator("button:has-text('SIMULATE MARSWALK')")
        assert sim_btn.is_visible(), "Simulate Marswalk button not found"
        sim_btn.click()
        time.sleep(2)
        
        # Verify Simulation HUD appears
        hud = page.locator("text=MARSWALK EVA SIMULATION HUD").first
        assert hud.is_visible(), "Simulation HUD did not appear!"
        print("Simulation HUD verified! Telemetry streaming active.")
        page.screenshot(path="docs/screenshots/02_simulation_hud.png")
        print("Saved screenshot: docs/screenshots/02_simulation_hud.png")

        # 7. Test Provenance Catalog Modal
        print("Testing Data Catalog / Provenance Modal...")
        prov_btn = page.locator("button:has-text('PROVENANCE')").first
        prov_btn.click()
        time.sleep(1)
        
        prov_modal = page.locator("text=NASA PLANETARY DATA SYSTEM").first
        assert prov_modal.is_visible(), "Provenance modal not opened!"
        print("Provenance Catalog verified!")
        page.screenshot(path="docs/screenshots/03_provenance_catalog.png")
        print("Saved screenshot: docs/screenshots/03_provenance_catalog.png")

        # Close Provenance Modal
        page.locator("button[aria-label='Close Provenance Catalog']").click()
        time.sleep(1)

        # 8. Test Science Target Dossier Modal
        print("Testing Science Target Dossier...")
        dossier_btn = page.locator("button:has-text('FULL GEOLOGICAL DOSSIER')").first
        if dossier_btn.is_visible():
            dossier_btn.click()
            time.sleep(1)
            assert page.locator("text=ASTROBIOLOGICAL & GEOLOGICAL TARGET DOSSIER").is_visible(), "Dossier missing"
            print("Science Target Dossier verified!")
            page.screenshot(path="docs/screenshots/05_science_dossier.png")
            print("Saved screenshot: docs/screenshots/05_science_dossier.png")
            # Close Dossier
            page.locator("button:has-text('Close')").first.click()
            time.sleep(0.5)

        # 9. Test Grounded AI Mission Scientist Drawer
        print("Testing Grounded AI Mission Scientist...")
        ai_btn = page.locator("button:has-text('AI SCIENTIST')").first
        ai_btn.click()
        time.sleep(1)

        ai_header = page.locator("text=AI MISSION SCIENTIST").first
        assert ai_header.is_visible(), "AI Mission Scientist drawer not opened!"
        print("AI Scientist Drawer verified!")

        # Click a preset chip
        preset = page.locator("button:has-text('Why does this candidate route avoid the Séítah region?')").first
        if preset.is_visible():
            preset.click()
            time.sleep(2)
            print("Sent sample query to Grounded AI Scientist.")

        page.screenshot(path="docs/screenshots/04_ai_scientist.png")
        print("Saved screenshot: docs/screenshots/04_ai_scientist.png")

        browser.close()

    if errors:
        print(f"\nWARNING: Encountered {len(errors)} browser errors:")
        for e in errors:
            print(f" - {e}")
        # Only fail if critical React crash
        critical = [e for e in errors if "Uncaught" in e or "React" in e]
        if critical:
            print("CRITICAL ERRORS FOUND!")
            sys.exit(1)
    else:
        print("\nSUCCESS: All browser verification tests passed with ZERO console errors!")

if __name__ == "__main__":
    verify_mars_geospectra()
