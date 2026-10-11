# Movie section
- [x] Add available trailer frames to every movie's Photos gallery and verify viewing controls.
- [x] Show portraits beside cast names on every film detail page.
- [x] Fill missing cast portraits and verify photo coverage.
- [x] Add a separate IMDb-style Movies page with detailed film information.
- [x] Add movie browsing, search, genre filters, and sorting to the shared navigation.
- [x] Verify movie interactions and mobile layout.

# Actor interface
- [x] Add actor entry, optional film and character, and separate name highlight controls.
- [x] Add live preview and edit/remove controls.
- [x] Verify actor interactions and mobile layout.

# Bottom navigation
- [x] Remove the pressed-in bevel effect from the icon tiles.
- [x] Use a flat gray tile that turns a slightly darker gray while pressed.
- [x] Verify resting, active, and pressed tile shades on a mobile-sized preview.

# Dark gray layout
- [x] Switch the whole app to a dark gray palette with light text.
- [x] Keep bottom nav tiles flat gray, turning slightly darker while pressed.
- [x] Retune quiz panels, name highlights, and the anatomy illustration for dark.
- [x] Verify every page on mobile and desktop.

# Studies navigation
- [x] Replace separate Vocabulary and Anatomy navigation entries with Studies.
- [x] Add a named custom-icon control with icon and destination selection for this visit.
- [x] Verify navigation and custom-icon interactions.

# Add studies
- [x] Add a plus control beneath the study cards to add more studies.
- [x] Let custom studies choose a name, icon, and destination for this visit.
- [x] Verify adding, editing, and removing studies.

# AI tab and chess reference
- [x] Add an AI navigation tab and custom model controls.
- [x] Match chess squares, pieces, coordinates, orientation, and move highlights to the reference.
- [x] Verify both pages and existing tests.

# Actor list trim
- [x] Remove the last six actors from the pre-loaded list, leaving fifty.
- [x] Drop their bios and portraits and update the actor tests.
- [x] Verify the Movies page shows fifty actors on mobile.

# Fifty more actors
- [x] Add fifty more popular actors with bios and portraits.
- [x] Update actor tests and verify the Movies page.

# Remove AI-poster films
- [x] Remove the six films that use generated artwork from the Movies catalog.

# Movies background color
- [x] Set the Movies section background to golden yellow RGB(239, 197, 0).
- [x] Keep dark text and slightly darker gold panels, borders, sidebar, and nav tiles.
- [x] Verify the Movies and film pages on mobile and desktop.

# Gray bottom bar
- [x] Make the bottom navigation bar gray on every page, including the golden Movies section.
- [x] Make the bar dark gray RGB(45, 45, 45), the icon squares lighter gray RGB(85, 85, 85), and the current tab's square RGB(107, 107, 107); icons brighter than labels.
- [x] Verify the bar on the Movies and home pages on mobile.

# Selectable chess Elo
- [x] Add slider and preset controls for the AI opponent and both AI sides.
- [x] Pass validated approximate Elo targets to chess AI move instructions.
- [x] Verify controls, navigation retention, and tests.

# Green play button
- [x] Show the chess Play button in green while the game is running and plain gray while paused.
- [x] Verify the color change with Pause and Play on mobile.

# Model picker under Elo
- [x] Place the chess AI model chooser directly beneath the Elo difficulty selectors.
- [x] Renumber the Chess page sections and verify the order on mobile.

# Per-side AI model selectors
- [x] Add a model selector for each colour directly underneath both Elo sliders.
- [x] Let White AI and Black AI run different models, remembered separately.
- [x] Verify the order, the choice, and that it survives a reload on mobile.




- [x] Add a live thinking timer (0.0s count-up) next to the AI's countdown ring on the left of the clock row.

# Beveled film tiles
- [x] Turn each movie listed under an actor into a raised, beveled tile with a poster thumbnail.
- [x] Use the same tiles for actor results in the movies search, with the role shown underneath.
- [x] Verify the tiles on a film page and in search on the golden Movies theme.

# Film tiles on actor cards
- [x] Show every film an actor appears in as beveled tiles under their details in the Actors list.
- [x] Keep the bio above the tiles when an actor's bio is expanded.
- [x] Verify tiles on seeded actors and on an actor further down the list.

# Details toggle
- [x] Hide each actor's film tiles behind a Details button on their card.
- [x] Keep the bio on the card itself and the tiles revealed only while Details is open.
- [x] Verify the button shows, hides, and reopens the tiles on the Movies page.

# Remove the Details button
- [x] Take the "Details" button out from underneath every actor's name.
- [x] Let the arrow chevron beside the name reveal the bio and the film tiles together.
- [x] Verify no Details button remains and the tiles still open and close.

# iPhone app
- [x] Add home-screen install support: app icon, name, dark launch color, full-screen display.
- [x] Keep the top bar clear of the status bar and the bottom bar clear of the home indicator.
- [x] Fit every bottom tab on one row on a phone-sized screen.
- [x] Verify the install files and the phone layout.

# Compact word library
- [x] Shrink each word to a single-line tile showing only the word and its part of speech.
- [x] Add a beveled detail key that opens the full definition, example and synonym inline.
- [x] Verify the library, the detail key, the part-of-speech filter and the phone layout.

# Explore topics
- [x] Remove the Practice section (level test, challenges, games, categories) from Vocabulary.
- [x] Add an Explore topics section with search and grouped tiles: quick tiles, About ourselves, By parts of speech, Culture, By level, Lexicon, The world around us, By test, By origin, Languages.
- [x] Give every topic its own word list opened in a panel with compact rows and detail keys.
- [x] Make Favorites, Collections, Your own words and History functional and saved on the device.
- [x] Verify with tests and on a phone-sized screen.

# Dictionary-style word details
- [x] Add original expanded meanings, pronunciation, examples and usage facts for every built-in vocabulary word.
- [x] Show the same rich details in the library, topics and flashcards while keeping closed rows compact.
- [x] Verify coverage, detail controls and mobile readability.

# Bug audit
- [x] Validate saved word-list entries so damaged data cannot crash Vocabulary.
- [x] Verify recovery, page navigation and existing tests.

# Split combined word entry
- [x] Replace "Bureaucratic charlatan" with separate Bureaucrat and Charlatan entries, each with its own meaning, example, synonym and full definition.
- [x] Verify both words appear in the library, topics and flashcards with their own details.

# Alphabetical sorting
- [x] Add a shared alphabetical sorting algorithm (collator-based, numeric-aware, accent-insensitive, stable) and use it for the word library, films, actors, videos and search tie-breaks.
- [x] Add an A–Z / Z–A toggle to the word library and verify ordering live on mobile and desktop.

# Adjustable chess time
- [x] Add a Time control section with presets (1+0 to 30+0), a minutes slider and a per-move bonus picker.
- [x] Apply the chosen time to the clocks on the next game and show it in the section title.
- [x] Verify presets, validation, tests and the phone layout.

# Added words: Kleptocracy and Hegemony
- [x] Add Kleptocracy and Hegemony to the word library with meaning, example, synonym and part of speech.
- [x] Place both in the Society, Advanced, GRE and Greek root topic panels.
- [x] Write full definitions with pronunciation, second example and word fact, and verify the detail panels open live.

# New game is ready, not paused
- [x] Make a new game start unpaused and ready, with the AI holding its first move until Play is pressed.
- [x] Show "Ready" in the game status and verify New game, Play and Pause live on the Chess page.
