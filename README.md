# @shmotryAIkov

A developer portfolio for apps, websites, Telegram bots and AI automations. A playful retro Mac interface with small windows, classic icons and lightweight motion.

[View the portfolio](https://makskrev.github.io/shmotryaikov-portfolio/) · [View the computer workshop website](https://makskrev.github.io/shmotryaikov-portfolio/projects/website.html)

## Run locally

This is a static HTML, CSS and JavaScript website. No build step or package installation is required.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Stop the server with `Ctrl+C`.

## Selected work

- **Telegram projects:** PRUstarsbot and a website parser that published property listings to a Telegram channel. Original screenshots show the actual results. A third tab presents **Buffer**, an explicitly labelled bot concept for turning voice notes and long messages into tasks; its artwork illustrates a proposed workflow, without a working bot or demo.
- **Machine learning:** a hackathon prototype for extracting information from technical drawings, shown with an original development photo.
- **Website:** an example computer workshop website inspired by Windows 95, 98 and XP. It is a website concept, not a completed client commission.

The website interface, accessibility labels, image viewer and computer workshop example are in English. Original project screenshots retain the language in which they were captured.

## Interaction and motion

The hero windows can be moved, minimized, closed and restored with the Mac icon in the navigation bar. Photos open in a keyboard-accessible viewer. Service and Telegram project tabs support arrow keys, Home and End.

Small passive animations illustrate the projects. They pause outside the viewport, in hidden panels and when the browser tab is hidden. Reduced-motion preferences are respected by default. The small play/pause button in the menu bar can explicitly enable or pause animations; the choice is remembered on that browser. Motion resumes after returning to the page, and older browsers have transform-based fallbacks. If visibility observers are unavailable, animations and content remain available.

## Files

- `index.html` — the main page.
- `shmotryAIkov.html` — an alias for the same page.
- `style.css` — the original visual foundation.
- `portfolio.css` — portfolio components and retro Mac details.
- `portfolio.js` — navigation, windows, tabs and the photo viewer.
- `assets/` — local images, icons and fonts.
- `projects/website.html` — the English computer workshop website.

GitHub Pages publishes the root of `main`. No backend, API keys or environment variables are required.

## Contact and references

- [Telegram: @shmotryAIkov](https://t.me/shmotryAIkov)
- [Build journal](https://t.me/chilovuyparen2)
- [ML project photo](https://t.me/chilovuyparen2/494)
- Visual reference: [heyclicky](https://www.heyclicky.com/).

The PRUstarsbot and parser screenshots were supplied by the portfolio owner and preserved unchanged. The computer workshop example uses Tiny5; its licence is included in `projects/Tiny5-OFL.txt`.
