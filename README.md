# Rick
## Presentation
Rick is an app that you can install on your desktop machine, that allows you to customise your Discord Rich Presence.

As of today, the **only** two supported platforms are:
- Windows 8 or later
- macOS Sierra (10.12) or later

## Installation
You should be able to get a "packaged" version of Rick in the "releases". Go ahead and extract that .zip file. There should be a .exe file for Windows users, or a .app for macOS users.

## Usage

1. Start the app by opening the file *(.exe for Windows, .app for MacOS)*, on your first visit, you'll see a splash screen.

2. On the main menu, click on the blue "New Rich Presence" button, and give your app a name. *(This name will only be used on the main menu, once you have multiple Rich Presence Configurations, and it will allow you to distiguish them).

3. Open your [Discord Developer Portal](http://discord.com/developers/applications) and create a new app. The name you will put there is **very** important, since it is the one displayed.

4. On the app's dashboard, go to Rich Presence > Art Assets, and under "Rich Presence Assets" click on add image, and add as many images as you want. For each image, you will want to give them a proper name. **If you refresh the webpage, you will see that images have dissapeared. In reality, they are still there, but you will have to wait and refresh every now and then until they reappear. This might take 10-15 minutes.**

5. Once everything is uploaded and not hidden anymore, go to "General Information", and copy the `Client ID`, that has the same structure as `762006887444119622` (*with different numbers obviously*).

6. Go back to Rick, and under Application ID, paste what you copied earlier.

7. Fill in all the details you want for your Rich Presence. In order to add images (max. 2), click on "Large image" and choose the name of one of the images you've uploaded earlier as well as a tooltip, which will be shown when you hover over the image. *In case it says "this application doesn't have any assets", that means you didn't wait enough on step 4*.

8. Since you filled everything, go back to the main menu, and hit "Run". This will show the Rich Presence on the account connected to the opened Discord. If you want to stop showing the rich presence, simply quit Rick.


## License
This code if available under GPL-2.0