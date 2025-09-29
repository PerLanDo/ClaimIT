# ClaimIT Mobile App - Live Preview Setup Guide

## 🚀 Quick Start

Your Expo development server is now running! Here's how to set up live preview on your mobile device:

## 📱 Option 1: Expo Go App (Recommended for Development)

### Step 1: Install Expo Go
- **Android**: Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Step 2: Connect to Your Development Server
1. Make sure your computer and mobile device are on the same WiFi network
2. Open the Expo Go app on your device
3. Scan the QR code displayed in your terminal/browser
4. Your app will load and you'll see live updates as you make changes!

## 🌐 Option 2: Web Browser Preview

1. Open your web browser
2. Navigate to the URL shown in your terminal (usually `http://localhost:8081`)
3. Click "Run in web browser" to see your app in the browser

## 📲 Option 3: iOS Simulator (Mac only)

1. Install Xcode from the Mac App Store
2. Open Xcode and install iOS Simulator
3. In your terminal, press `i` to open iOS Simulator
4. Your app will launch in the simulator

## 🤖 Option 4: Android Emulator

1. Install Android Studio
2. Set up an Android Virtual Device (AVD)
3. Start the emulator
4. In your terminal, press `a` to open Android Emulator
5. Your app will launch in the emulator

## 🔧 Development Commands

While the development server is running, you can use these commands:

- **Press `r`** - Reload the app
- **Press `m`** - Toggle the menu
- **Press `d`** - Show developer menu
- **Press `j`** - Open debugger
- **Press `c`** - Clear cache and reload
- **Press `i`** - Open iOS simulator (Mac only)
- **Press `a`** - Open Android emulator
- **Press `w`** - Open in web browser
- **Press `?`** - Show all commands

## 🛠️ Troubleshooting

### Common Issues:

1. **QR Code not working?**
   - Make sure both devices are on the same WiFi network
   - Try using the tunnel option: `npx expo start --tunnel`

2. **App not loading?**
   - Check your terminal for error messages
   - Try clearing cache: `npx expo start --clear`

3. **Metro bundler issues?**
   - Restart the development server
   - Clear node modules: `rm -rf node_modules && npm install`

4. **Network issues?**
   - Use tunnel mode: `npx expo start --tunnel`
   - Check firewall settings

## 📋 Features Available in Live Preview

✅ **Hot Reloading** - See changes instantly
✅ **Error Overlay** - Debug errors in real-time
✅ **Performance Monitor** - Track app performance
✅ **Network Inspector** - Monitor API calls
✅ **Element Inspector** - Inspect UI components

## 🔄 Making Changes

1. Edit any file in your `src/` directory
2. Save the file
3. The app will automatically reload with your changes
4. No need to restart the development server!

## 📱 Testing on Multiple Devices

You can test on multiple devices simultaneously:
- Scan the QR code on different devices
- Each device will show the same app with live updates
- Perfect for testing on different screen sizes and platforms

## 🎯 Next Steps

1. **Install Expo Go** on your mobile device
2. **Scan the QR code** from your terminal
3. **Start developing** - any changes you make will appear instantly!

## 📞 Need Help?

- Check the [Expo Documentation](https://docs.expo.dev/)
- Visit the [Expo Community](https://forums.expo.dev/)
- Check your terminal for specific error messages

---

**Happy coding! 🎉**

Your ClaimIT app is now ready for live preview development!
