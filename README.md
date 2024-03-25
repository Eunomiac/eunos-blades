<!--
TO RUN DEVELOPMENT SERVER:

- Open TWO Powershell7 windows (as Administrator)
  - cd 'D:\Users\Ryan\Documents\Projects\.CODING\FoundryVTT\FoundryDevData\Data\systems\eunos-blades'
  - npx vite build
- When build process completes, run (in the same window):
  - node 'D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/main.js' --dataPath='D:\Users\Ryan\Documents\Projects\!Roleplaying\!!!FOUNDRY'

- In second Powershell7 window:
  - npx vite serve
-->


# Euno's "Blades In The Dark" for Foundry VTT

| [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades)  | [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) |
| :-----------: | :-----------: |
| [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) <br /> [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) | [![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) <br /> [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Eunomiac_eunos-blades&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Eunomiac_eunos-blades) |
c
Welcome to Eunomiac's system implementation for "Blades in the Dark" by [Evil Hat Productions](https://evilhat.com/) for the [Foundry Virtual Tabletop](https://foundryvtt.com/) platform. This project aims to bring the intricate and exciting world of "Blades in the Dark" to your virtual tabletop with full-featured character sheets, collaborative tools for GMs and players, and more.

## THE GAME
> *Blades in the Dark is a game about a group of daring scoundrels building a criminal enterprise on the haunted streets of an industrial-fantasy city. There are heists, chases, escapes, dangerous bargains, bloody skirmishes, deceptions, betrayals, victories, and deaths.*
>
> *We play to find out if the fledgling crew can thrive amidst the teeming threats of rival gangs, powerful noble families, vengeful ghosts, the Bluecoats of the City Watch, and the siren song of the scoundrels’ own vices.*

<h1 color="#FF0000" align="center" style="border: none; font-size: 18px; text-align: center; display: block; width: 100%;">You’re in a haunted Victorian-era city <br /> trapped inside a wall of lightning <br /> powered by demon blood.</h1>

> The game takes place in the cold, foggy city of **Doskvol** (aka Duskwall or “the Dusk”). It’s **industrial** in its development. Imagine a world like ours during the second industrial revolution of the 1870s—there are trains, steam-boats, printing presses, simple electrical technology, carriages, and the black smog of chimney smoke everywhere. Doskvol is something like a mashup of Venice, London, and Prague. It’s crowded with row-houses, twisting streets, and criss-crossed with hundreds of little waterways and bridges.
>
> The city is also a **fantasy**. The world is in perpetual darkness and haunted by ghosts—a result of the cataclysm that shattered the sun and broke the Gates of Death a thousand years ago. The cities of the empire are each encircled by crackling lightning towers to keep out the vengeful spirits and twisted horrors of the deathlands. To power these massive barriers, the titanic metal ships of the leviathan hunters are sent out from Doskvol to extract electroplasmic blood from massive demonic terrors upon the ink-dark Void Sea.
<br>
The main highlights include detailed sheets for all character types, easy-to-use progress clocks, and a unique collaborative roll control system that brings players and GMs together during gameplay. Scroll down for a visual overview and key features.

<h1 align="center">⚜⚜⚜ Gorgeous Character Sheets! ⚜⚜⚜</h1>
<table width="100%" style="background-color: #131313;" bgcolor="#131313">
  <tr style="background-color: #131313;" bgcolor="#131313">
    <td width="50%" align="center" valign="top" style="background-color: #131313;" bgcolor="#131313">
      <br><b>... For the Players!</b><br><br>
      <a href="https://github.com/Eunomiac/eunos-blades/assets/5692071/7ddac70d-cfab-4961-b691-6b3109ec8372" target="_blank">
        <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/7ddac70d-cfab-4961-b691-6b3109ec8372" width="100%" alt="Scoundrel Sheet">
      </a>
    </td>
    <td width="50%" align="center" valign="top" style="background-color: #131313;" bgcolor="#131313">
      <br><b>... For the Crew!</b><br><br>
      <a href="https://github.com/Eunomiac/eunos-blades/assets/5692071/9829ce6f-2e57-4e31-82e9-b97cfeb42369" target="_blank">
        <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/9829ce6f-2e57-4e31-82e9-b97cfeb42369" width="100%" alt="Crew Sheet">
      </a>
    </td>
  </tr>
  <tr style="background-color: #131313;" bgcolor="#131313">
    <td width="50%" align="center" valign="top" style="background-color: #131313;" bgcolor="#131313">
      <br><b>... For NPCs!</b><br><br>
      <a href="https://github.com/Eunomiac/eunos-blades/assets/5692071/e4a2228d-76ae-4b25-ae2e-259406c18d3c" target="_blank">
        <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/e4a2228d-76ae-4b25-ae2e-259406c18d3c" width="100%" alt="NPC Sheets">
      </a>
    </td>
    <td width="50%" align="center" valign="top" style="background-color: #131313;" bgcolor="#131313">
      <br><b>... Even for Factions!</b><br><br>
      <a href="https://github.com/Eunomiac/eunos-blades/assets/5692071/93f101e0-cef4-4959-86bd-0220a2ba6c32" target="_blank">
        <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/93f101e0-cef4-4959-86bd-0220a2ba6c32" width="100%" alt="Faction Sheets">
      </a>
    </td>
  </tr>
</table>

<h1 align="center">⚜⚜⚜ Progress Clocks! ⚜⚜⚜</h1>
<p>An easy controller for the GM, grouped into keys for display to players.</p>

![clock_control](https://github.com/Eunomiac/eunos-blades/assets/5692071/f7e5303e-9b06-4e0e-9709-186d8ea8e795)

(They're animated, too!)
<p align="center">
  <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/4192e21d-1f94-49c6-b49e-7ad6464f8f70" width="800px" alt="Progress Clocks Animation">
</p>

<h1 align="center">⚜⚜⚜ Collaborative Dice Rolls! ⚜⚜⚜</h1>
<p>Whenever a player makes a roll, screens pop up for both the player and the GM to aid in collaborating on the details of the roll.</p>
<p align="center">
  <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/22ad7d8a-59e7-49c2-86e2-9826be70b238" width="800px" alt="Roll Collab: Player">
</p>

<p>The roll dialog is automatically populated with all abilities, effects and applicable factors, and updates in real time as both players make modifications:</p>
<p align="center">
  <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/8d6fe4f2-39a8-49ae-8210-dc0ba45fab54" width="800px" alt="Roll Collab Animation">
</p>

<h1 align="center">⚜⚜⚜ Fully Automated Game Content! ⚜⚜⚜</h1>
<p align="center"><i>(assuming you can supply the licensed content yourself, that is)</i></p>
<p align="center">
  <img src="https://github.com/Eunomiac/eunos-blades/assets/5692071/2926f84c-c175-4800-aff1-6b6893fc1bc6" width="800px" alt="Abilities">
</p>