import { useFloating } from "solid-floating-ui";
import {
  For,
  JSX,
  Ref,
  Show,
  createEffect,
  createSignal,
  on,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { styled } from "styled-system/jsx";

import { Input } from "../features";
import { Column } from "../layout";

// Styled components using styled-system for layout and styling consistency
const Base = styled(Column, {
  base: {
    width: "400px",
    height: "400px",
    paddingInlineEnd: "5px",
    userSelect: "none", // Disable text selection for better UX
  },
});

const Container = styled("div", {
  base: {
    flexGrow: 1,
    display: "flex",
    height: "400px",
    flexDirection: "column",
    color: "white",
    backgroundColor: "black",
    borderRadius: "var(--borderRadius-md)",
    boxShadow: "0 4px 12px rgb(0 0 0 / 0.7)", // subtle shadow for depth
  },
});

const GifList = styled("div", {
  base: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", // responsive grid
    overflowY: "auto",
    padding: "5px",
    scrollbarWidth: "thin",
    scrollbarColor: "var(--accent, #9b59b6) transparent",
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "var(--accent, #9b59b6)", // accent colored scrollbar thumb
      borderRadius: "3px",
    },
  },
});

const TopBar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
  },
});

const Tabs = styled("div", {
  base: {
    display: "flex",
    gap: "10px",
  },
});

const TabButton = styled("button", {
  base: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
    borderBottom: "2px solid transparent",
    transition: "border-color 0.2s ease-in-out",
    // Active tab indicator
    "&[data-active='true']": {
      borderColor: "var(--accent, #9b59b6)",
    },
    _hover: { color: "var(--accent, #9b59b6)" },
  },
});

// Props for CompositionPicker, includes callback for sending selected GIF message
interface Props {
  children: (triggerProps: {
    ref: Ref<any>;
    onClickGif: () => void;
    onClickEmoji: () => void;
  }) => JSX.Element;
  sendGIFMessage: (content: string) => void;
}

// Type definition for Tenor GIF format, simplified for tinygif url usage
type TenorGif = {
  id: string;
  media_formats: { tinygif: { url: string } };
};

// Universal StarIcon component with accessible SVG and styling for filled/unfilled states
function StarIcon(props: { filled: boolean; size?: number }) {
  return (
    <svg
      width={props.size ?? 24}
      height={props.size ?? 24}
      viewBox="0 0 24 24"
      // Light yellow fill for unfilled star with opacity for subtlety
      fill={props.filled ? "yellow" : "#ffffff46"}
      // Dark stroke for contrast on light/dark backgrounds
      stroke="#444"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      // Drop shadow for subtle glow to improve visibility on all backgrounds
      style={{ display: "block", filter: "drop-shadow(0 0 1px rgba(0,0,0,0.7))" }}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

// Main CompositionPicker component for selecting and sending GIFs
export function CompositionPicker(props: Props) {
  // Anchor and floating refs used by floating-ui for positioning the popup
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();

  // Visibility state for the GIF picker popup
  const [show, setShow] = createSignal(false);

  // Current tab: all, Favourites, or search results
  const [tab, setTab] = createSignal<"all" | "Favourites" | "search">("all");

  // Use floating-ui's useFloating hook for popup positioning with middleware
  const position = useFloating(anchor, floating, {
    placement: "top-end", // Popup appears above and aligned right of trigger
    whileElementsMounted: autoUpdate, // Automatically update position on scroll/resize
    middleware: [offset(5), flip(), shift()], // Position adjustments to avoid overflow
  });

  // Signals to hold GIF data, loading state, and errors
  const [data, setData] = createSignal<TenorGif[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Local storage key for saving favourite GIFs persistently
  const Favourites_KEY = "compositionPickerFavourites";
  const [Favourites, setFavourites] = createSignal<TenorGif[]>([]);

  // Store last search term to display in UI
  const [lastSearchTerm, setLastSearchTerm] = createSignal("");

  // Load favourites from localStorage on mount
  createEffect(() => {
    const saved = localStorage.getItem(Favourites_KEY);
    if (saved) {
      try {
        setFavourites(JSON.parse(saved));
      } catch {
        setFavourites([]);
      }
    }
  });

  // Save favourites to localStorage whenever updated
  createEffect(() => {
    localStorage.setItem(Favourites_KEY, JSON.stringify(Favourites()));
  });

  let fetched = false; // Track if featured GIFs have been fetched to avoid repeat

  // Tenor API key 
  const TENOR_KEY = "AIzaSyASvLUzOc-N3vO6yJwlfz5nnlBCX8jhMe8";

  // Fetch GIFs from Tenor API with retry logic
  async function fetchTenor(url: string, retries = 1) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        const statusText = response.statusText || "Unknown Error";
        throw new Error(`Request failed: ${response.status} ${statusText}`);
      }

      const data = await response.json();

      const results = Array.isArray(data.results) ? data.results : [];
      setData(results);

      if (results.length === 0) {
        setError("No GIFs found. Try a different keyword.");
      }
    } catch (error) {
      console.error("Tenor API fetch error:", error);

      if (retries > 0) {
        console.warn(`Retrying fetch... (${retries} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        return fetchTenor(url, retries - 1);
      }

      setError(
        error instanceof Error
          ? `Could not fetch GIFs: ${error.message}`
          : "An unexpected error occurred while fetching GIFs."
      );

      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }

  // Fetch featured GIFs on first show of picker popup
  createEffect(
    on(
      () => show(),
      (visible) => {
        if (visible && !fetched) {
          fetchTenor(
            `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=50&media_filter=tinygif`
          ).then(() => (fetched = true));
        }
      }
    )
  );

  // Perform a search query against Tenor API
  function search(query: string) {
    if (!query.trim()) return;
    setLastSearchTerm(query);
    fetchTenor(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
        query
      )}&key=${TENOR_KEY}&limit=50&media_filter=tinygif`
    ).then(() => setTab("search"));
  }

  // Check if a GIF is favourited
  function isFavourited(gif: TenorGif) {
    return Favourites().some((f) => f.id === gif.id);
  }

  // Toggle GIF favouriting/unfavouriting
  function toggleFavourite(gif: TenorGif) {
    if (isFavourited(gif)) {
      setFavourites(Favourites().filter((f) => f.id !== gif.id));
    } else {
      setFavourites([...Favourites(), gif]);
    }
  }

  // Determine which GIFs to display based on current tab
  const displayedData = () => (tab() === "Favourites" ? Favourites() : data());

  return (
    <>
      {/* Render children with trigger props for opening picker */}
      {props.children({
        ref: setAnchor,
        onClickGif: () => setShow(!show()),
        onClickEmoji: () => setShow(!show()),
      })}

      {/* Render picker popup inside portal for better layering */}
      <Portal mount={document.getElementById("floating")!}>
        <Presence>
          <Show when={show()}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
            >
              <Base
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                }}
                role="tooltip"
              >
                <Container>
                  <TopBar>
                    {/* Search input with Enter key handling */}
                    <Input
                      placeholder="Search Tenor" // TODO: i18n support
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          search(e.currentTarget.value.trim());
                        }
                      }}
                      style={{ flexGrow: "1", marginRight: "8px" }}
                    />

                    {/* Tabs to switch between featured, favourites, and search */}
                    <Tabs>
                      {tab() === "search" ? (
                        <>
                          <TabButton
                            type="button"
                            onClick={() => {
                              setTab("all");
                              setLastSearchTerm("");
                              if (!fetched) {
                                fetchTenor(
                                  `https://tenor.googleapis.com/v2/featured?key=${TENOR_KEY}&limit=50&media_filter=tinygif`
                                ).then(() => (fetched = true));
                              }
                            }}
                            data-active={false}
                          >
                            ← Back to Featured {/* TODO: i18n */}
                          </TabButton>
                          <TabButton
                            data-active={false}
                            disabled
                            style={{ cursor: "default", opacity: 0.7 }}
                          >
                            Search: "{lastSearchTerm()}" {/* TODO: i18n */}
                          </TabButton>
                        </>
                      ) : (
                        <>
                          <TabButton
                            data-active={tab() === "all"}
                            onClick={() => setTab("all")}
                            type="button"
                          >
                            Featured {/* TODO: i18n */}
                          </TabButton>
                          <TabButton
                            data-active={tab() === "Favourites"}
                            onClick={() => setTab("Favourites")}
                            type="button"
                          >
                            Favourites {/* TODO: i18n */}
                          </TabButton>
                        </>
                      )}
                    </Tabs>
                  </TopBar>

                  <GifList>
                    {/* Loading indicator */}
                    <Show when={loading()}>
                      <div style={{ color: "gray", textAlign: "center" }}>
                        Loading GIFs...
                      </div>
                    </Show>

                    {/* Error message display */}
                    <Show when={error()}>
                      <div style={{ color: "red", textAlign: "center" }}>
                        {error()}
                      </div>
                    </Show>

                    {/* List GIFs with favourite toggle */}
                    <For each={displayedData()}>
                      {(entry) => {
                        const [hovered, setHovered] = createSignal(false);
                        return (
                          <div
                            style={{ position: "relative" }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                          >
                            {/* Clicking the GIF sends the message */}
                            <a
                              onClick={() =>
                                props.sendGIFMessage(
                                  entry.media_formats.tinygif.url
                                )
                              }
                              aria-label="Send this GIF" // TODO: i18n
                            >
                              <img
                                src={entry.media_formats.tinygif.url}
                                alt={`GIF image with ID ${entry.id}`}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  borderRadius: "8px",
                                  display: "block",
                                  userSelect: "none",
                                }}
                              />
                            </a>

                            {/* Favourite star button appears on hover */}
                            <Motion
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={
                                hovered()
                                  ? { opacity: 1, scale: 1 }
                                  : { opacity: 0, scale: 0.8 }
                              }
                              transition={{ duration: 0.25 }}
                              style={{
                                position: "absolute",
                                top: "6px",
                                right: "6px",
                                pointerEvents: hovered() ? "auto" : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                aria-label={
                                  isFavourited(entry)
                                    ? "Remove from Favourites" // TODO: i18n
                                    : "Add to Favourites" // TODO: i18n
                                }
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  color: isFavourited(entry) ? "yellow" : "white",
                                  userSelect: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "28px",
                                  height: "28px",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation(); // Prevent GIF send on star click
                                  toggleFavourite(entry);
                                }}
                              >
                                <StarIcon
                                  filled={isFavourited(entry)}
                                  size={24}
                                />
                              </button>
                            </Motion>
                          </div>
                        );
                      }}
                    </For>

                    {/* Empty state messages */}
                    <Show when={tab() === "Favourites" && Favourites().length === 0}>
                      <div style={{ color: "gray", textAlign: "center", padding: "1rem" }}>
                        No favourites yet. Click the ★ to add some. {/* TODO: i18n */}
                      </div>
                    </Show>

                    <Show when={tab() === "search" && !loading() && data().length === 0}>
                      <div style={{ color: "gray", textAlign: "center", padding: "1rem" }}>
                        No results for "{lastSearchTerm()}". {/* TODO: i18n */}
                      </div>
                    </Show>
                  </GifList>
                </Container>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
