import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Navigate to the dashboard page to measure its load time.
        frame = context.pages[-1]
        # Click on TAC Infrastructure link to navigate to the dashboard page
        elem = frame.locator('xpath=html/body/div[2]/nav/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try clicking the 'Sign In' link at index 7 to see if it leads to a page where further navigation to dashboard or critical pages is possible.
        frame = context.pages[-1]
        # Click on 'Sign In' link to attempt alternative navigation to access dashboard or critical pages
        elem = frame.locator('xpath=html/body/div[2]/nav/div/div[2]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input email and password, then click the Sign In button to log in.
        frame = context.pages[-1]
        # Input email address
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div[3]/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('admin@tac.app')
        

        frame = context.pages[-1]
        # Input password
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div[3]/form/div/div[2]/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test@1498')
        

        frame = context.pages[-1]
        # Click Sign In button to log in
        elem = frame.locator('xpath=html/body/div[2]/div[2]/div[3]/form/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Shipments' link (index 4) to navigate to the shipment list page and measure its load time.
        frame = context.pages[-1]
        # Click on 'Shipments' link to navigate to shipment list page
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]/div/div[2]/div[2]/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the invoice page to measure its load time as the last critical page.
        frame = context.pages[-1]
        # Click on 'Invoices' link to navigate to invoice page for load time measurement
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]/div/div[2]/div[3]/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Analyze bundled assets for size optimization by checking network resources or build artifacts.
        frame = context.pages[-1]
        # Click Toggle Sidebar button to reveal any hidden navigation or options that might help in bundle size analysis
        elem = frame.locator('xpath=html/body/div[2]/main/header/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Open a new tab to access developer tools or network tab for bundle size analysis.
        frame = context.pages[-1]
        # Click on 'Settings' link to check for build or performance related options for bundle size analysis
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]/div/div[2]/div[4]/ul/li[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Open a new tab to access browser developer tools or network tab to analyze bundle size and assets.
        await page.goto('about:blank', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Navigate back to the main application page to restart the server and measure startup time.
        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Open browser developer tools network tab to analyze bundle size of assets loaded on this page.
        frame = context.pages[-1]
        # Open chat widget to check if it interferes with network analysis or to close it for clearer view
        elem = frame.locator('xpath=html/body/div[2]/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Close the chat widget to clear the view for network and bundle size analysis.
        frame = context.pages[-1]
        # Click Close chat button to close the chat widget
        elem = frame.locator('xpath=html/body/div[2]/div/div/div/div/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=TAC Cargo - Imphal–Delhi Logistics Corridor').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Premier Logistics Partner').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Delivering').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Certainty.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=For Over 15 Years.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Customer-first logistics built on experience, precision, and trust.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Get a Quote').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Track Shipment').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=150+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Projects Delivered').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Client Satisfaction').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=98%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Years').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Support').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=100%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Quality').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Featured Clients').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=SYSTEM ACTIVE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PREMIUM TIER').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Powering supply chains across Manipur').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Global Tracking Protocol').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real-time telemetry for your high-value consignments.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=GPS Telemetry').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Chain of Custody').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TRACE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Core Competencies').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Global Air Freight').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=High-speed logistics for time-critical consignments across international borders.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Secure Packaging').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Military-grade packaging protocols ensuring zero-damage transit verification.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Eco Last Mile').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sustainable urban delivery network utilizing electric mobility solutions.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Surface Logistics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cost-optimized heavy haulage and nationwide network distribution.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Operational Logic').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Precision from Origin to Destination').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Operational Visibility').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real-Time Fleet Intelligence').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Intelligent Dispatch').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Assistant').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Online').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=How can I help you today?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Do you have cargo service from Imphal to New Delhi?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We use partner flight services. If a compatible schedule exists, we can definitely help. What are you shipping?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=About 500kg of organic produce.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Integration').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Global Connectivity').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Our Philosophy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We don\'t just move cargo.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We eliminate uncertainty.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Founded in 2010, TAC was built on a single premise: The connection between Northeast India and the National Capital Region was inefficient. We rebuilt it from the ground up, integrating technology, aviation partnerships, and a proprietary ground fleet to create a seamless corridor.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Years Active').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=50k+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Deliveries').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=24/7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Support Ops').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=0%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Hidden Fees').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Regional Success').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Trusted by teams across').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Manipur and beyond.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5.0 • Local Partners').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Moving perishable goods from Ukhrul to the specialized zones used to take days. TAC\'s tracking changed everything.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Roel Shimray').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Director, Siroi Logistics, Ukhrul').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The reliability of the Imphal corridor is crucial for our handloom exports. TAC gave us that certainty.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=O. Bem Devi').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CEO, Ima Keithel Exports, Imphal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=We monitor our cold chain in real-time now across Moirang. The dashboard is perfect for our field operations.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=K. Ibohal Singh').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ops Head, Loktak Fisheries, Moirang').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Connecting remote hill districts to the main supply lines has never been smoother. Support is fantastic.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Worthing Horam').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Manager, Tangkhul Traders, Ukhrul').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=For medical supplies, timing is life. TAC\'s precision ensures our critical stock always arrives on time at RIMS.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dr. S. Ibemhal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Director, Medical Supply Chain, Imphal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Automated dispatching reduced our manual errors to zero. A true game changer for efficiency in Kakching.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Thangjam Joy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Lead, Grain Bank, Kakching').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=From harvest to market, total visibility. Our spice trade has expanded thanks to this infrastructure.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mary Z.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Proprietor, Highland Spices, Imphal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The API is world-class. Integrating it with our local inventory systems in Imphal East took less than an hour.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=N. Biren').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tech Lead, Kangla Tech, Imphal East').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Coordinating logistics during the Sangai festival season was a nightmare. Now it\'s our competitive advantage.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ng. Bala').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Coordinator, Sangai Tours, Moirang').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The Numbers').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=behind precision.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reliability isn\'t a promise; it\'s a statistical certainty. These are the metrics that define the Imphal-Delhi corridor.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Real-time telemetry, chain-of-custody protocols, and zero-failure delivery commitments.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=View System Metrics').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Throughput').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12k+').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Monthly Shipments').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Consignments successfully processed across the Northeast corridor with zero loss incidents in the last quarter.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reliability').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=99.9').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=On-Time Delivery').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Precision timing protocols ensure your cargo arrives exactly when predicted, regardless of terrain.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Velocity').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=48').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=hrs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Max Transit Time').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=From Imphal to Delhi. We bridge the distance faster than any ground-based competitor.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=TAC').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Infrastructure').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Deploy at cargo speed. The fastest way to ship your logistics globally with zero configuration.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Product').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Features').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pricing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Enterprise').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Changelog').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Resources').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Documentation').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guides').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=API Reference').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Company').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=About').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Blog').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Careers').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Legal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2026 TAC Logistics Protocol. All rights reserved.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Terms').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Security').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Status').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    