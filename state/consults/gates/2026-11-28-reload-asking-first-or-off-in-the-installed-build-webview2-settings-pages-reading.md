# The reload keys: Microsoft's two WebView2 settings pages, read under ADV-2026-11-28-09 item 7

*Filed by the custodian. A web-fetch reader (Sonnet) was dispatched at 2026-11-28T05:30:51Z (date -u) with the two addresses that ADV-2026-11-28-09 item 7 names, and asked for the property texts, the sentences on when setting changes apply, each page's version label and dates, and where the maintenance note leads. By the facts script its records run from 2026-11-28T05:31:01Z to 2026-11-28T05:31:41Z, and 0 of its calls ran with the main checkout as its working folder. By its completion it took 39548 ms and 4 tool uses. Its hand-back is below as received, with the harness indent removed: 9109 bytes, sha256 d73c55b53e7e5a4d269d3797041229af18667a7a541e1ea27badec9feec41dd0. The quotations in it are the reader's copies of the pages, not this repository's text.*

---

REPORT (WebView2 settings pages, read 2026-11-28). Everything marked VERBATIM is copied from the page. Everything marked SUMMARY is mine.

HEADLINE: Both pages carry a "no longer being maintained" note. Its link goes to a general WebView2 API Reference landing page. That page has no per-property content for either property. It links only to the Win32 C++ reference index, which carries the same note and loops back. So there is no newer page where AreDefaultContextMenusEnabled or AreBrowserAcceleratorKeysEnabled can be read, and I could not do the newer-page comparison. Details are under each page.

=== PAGE 1 ===
Address read: https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings (HTTP 200, no redirect). Its canonicalUrl metadata is the same address with ?view=webview2-1.0.4314.35 appended.

Version label (VERBATIM, from the page metadata): defaultMoniker: webview2-1.0.4314.35. The "Applies to" table on the page says: "WebView2 Win32 | 0.9.430" and "WebView2 Win32 Prerelease | 0.9.488".

Date lines (VERBATIM, from the page metadata): "ms.date: 2026-10-19T00:00:00.0000000Z" and "updated_at: 2026-11-22T14:03:00.0000000Z". There is no visible "last updated" line in the page body.

Maintenance note (VERBATIM): "This reference is no longer being maintained. For the latest API reference, see [WebView2 API Reference](/en-us/microsoft-edge/webview2/webview2-api-reference)."

--- Property text (VERBATIM) ---
Heading: get\_AreDefaultContextMenusEnabled
Description: "The `AreDefaultContextMenusEnabled` property is used to prevent default context menus from being shown to user in WebView."
Signature: "public HRESULT get_AreDefaultContextMenusEnabled(BOOL \* enabled)"
Default: "The default value is `TRUE`."
Remarks: the page has no separate remarks paragraph for this property. The only other text under it is a C++ sample. Its message strings are "Context menus will be disabled after the next navigation." and "Context menus will be enabled after the next navigation."
Setter (VERBATIM): "Sets the `AreDefaultContextMenusEnabled` property." with signature "public HRESULT put_AreDefaultContextMenusEnabled(BOOL enabled)"
The Summary table row (VERBATIM) reads: "The `AreDefaultContextMenusEnabled` property is used to prevent default context menus from being shown to user in WebView."

--- Sentences about when setting changes take effect (VERBATIM) ---
1. In the page body, under the Summary table: "Changes to `IsGeneralAutofillEnabled` and `IsPasswordAutosaveEnabled` apply immediately, while other setting changes made after `NavigationStarting` event do not apply until the next top-level navigation."
2. In the get_IsScriptEnabled sample code, a comment (the only other sentences on the page about timing): "Changes to settings will apply at the next navigation, which includes the" / "navigation after a NavigationStarting event.  We can use this to change" / "settings according to what site we're visiting."
3. Sample message strings, not prose: "Context menus will be disabled after the next navigation." and "Context menus will be enabled after the next navigation." The same pattern appears for host objects ("Access to host objects will be denied after the next navigation.") and zoom control ("Zoom control will be disabled after the next navigation.").
4. Related, not about "settings changes" in general: get_IsScriptEnabled says "Controls if running JavaScript is enabled in all future navigations in the WebView." IsBuiltInErrorPageEnabled's sample message says "Built-in error page will be disabled for future navigation."

--- Newer page for page 1 ---
The note's link leads to https://learn.microsoft.com/en-us/microsoft-edge/webview2/webview2-api-reference (HTTP 200). Its metadata shows ms.date: 2024-04-23T00:00:00.0000000Z and updated_at: 2026-06-12T15:26:00.0000000Z. It shows no version label and no maintenance note.
SUMMARY: this is a landing page with a platforms list (.NET/C#, WinRT/C#, Win32/C++) and a JavaScript section. Its only Win32 link is "[API Reference for WebView2 Win32 C++](/en-us/microsoft-edge/webview2/reference/win32)". It does not contain AreDefaultContextMenusEnabled or any sentence on when settings changes apply.
I followed that link once: https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32 (HTTP 200). It is the "WebView2 Win32 C++ Reference" index at version moniker webview2-1.0.4314.35, with ms.date 2026-10-19 and updated_at 2026-11-22. It carries the identical note (VERBATIM): "This reference is no longer being maintained. For the latest API reference, see [WebView2 API Reference](/en-us/microsoft-edge/webview2/webview2-api-reference)." It lists ICoreWebView2Settings through ICoreWebView2Settings9 as links. It is the same unmaintained reference, so it loops back to the landing page.
Result: I found no newer page that holds this property or the sentence on when changes apply. So I cannot say whether newer text differs from page 1's text. I did not guess other URLs, and I did not fetch the versioned variants of the Settings pages.

=== PAGE 2 ===
Address read: https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings3 (HTTP 200, no redirect). Its canonicalUrl metadata adds ?view=webview2-1.0.4314.35.

Version label (VERBATIM): defaultMoniker: webview2-1.0.4314.35. The "Applies to" table says: "WebView2 Win32 | 1.0.864.35" and "WebView2 Win32 Prerelease | 1.0.865".

Date lines (VERBATIM): "ms.date: 2026-10-19T00:00:00.0000000Z" and "updated_at: 2026-11-22T14:03:00.0000000Z". There is no visible "last updated" line in the page body.

Maintenance note (VERBATIM): "This reference is no longer being maintained. For the latest API reference, see [WebView2 API Reference](/en-us/microsoft-edge/webview2/webview2-api-reference)." It leads to the same landing page as page 1's note, with the same result described above.

--- AreBrowserAcceleratorKeysEnabled (VERBATIM) ---
Interface description: "A continuation of the [ICoreWebView2Settings](icorewebview2settings#icorewebview2settings) interface that manages whether browser accelerator keys are enabled."
Getter heading: get\_AreBrowserAcceleratorKeysEnabled
Getter description: "Gets the `AreBrowserAcceleratorKeysEnabled` property."
Getter signature: "public HRESULT get_AreBrowserAcceleratorKeysEnabled(BOOL \* value)"
Setter heading: put\_AreBrowserAcceleratorKeysEnabled
Setter description: "When this setting is set to FALSE, it disables all accelerator keys that access features specific to a web browser, including but not limited to:"
Setter signature: "public HRESULT put_AreBrowserAcceleratorKeysEnabled(BOOL value)"

List 1, keys the setting turns off (VERBATIM, item by item):
- "Ctrl-F and F3 for Find on Page"
- "Ctrl-P for Print"
- "Ctrl-R and F5 for Reload"
- "Ctrl-Plus and Ctrl-Minus for zooming"
- "Ctrl-Shift-C and F12 for DevTools"
- "Special keys for browser functions, such as Back, Forward, and Search"

Lead-in to list 2 (VERBATIM): "It does not disable accelerator keys related to movement and text editing, such as:"
List 2, keys that stay on (VERBATIM, item by item):
- "Home, End, Page Up, and Page Down"
- "Ctrl-X, Ctrl-C, Ctrl-V"
- "Ctrl-A for Select All"
- "Ctrl-Z for Undo"

Remarks that follow (VERBATIM):
- "Those accelerator keys will always be enabled unless they are handled in the `AcceleratorKeyPressed` event."
- "This setting has no effect on the `AcceleratorKeyPressed` event. The event will be fired for all accelerator keys, whether they are enabled or not."
Default (VERBATIM): "The default value for `AreBrowserAcceleratorKeysEnabled` is TRUE."
The sample code's message strings (VERBATIM): "Browser-specific accelerator keys will be disabled after the next " "navigation." and "Browser-specific accelerator keys will be enabled after the next " "navigation."
The Summary table row for the setter (VERBATIM) is cut off after the colon: "When this setting is set to FALSE, it disables all accelerator keys that access features specific to a web browser, including but not limited to:"
This page has no sentence about when settings changes take effect, other than the sample message strings above.

--- Newer page for page 2 ---
The note's link goes to the same landing page and Win32 index as for page 1, and neither has ICoreWebView2Settings3 or AreBrowserAcceleratorKeysEnabled text. I found no newer page for this property, so no comparison is possible.

Caveat: the Win32 index fetch was truncated at 39,914 of 49,624 characters. The rest came back as a model-made summary, which I did not rely on. It is the tail of the version-picker link list. The index's note text, its date lines and its Settings links all came from the verbatim part.

Addresses fetched:
https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings
https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings3
https://learn.microsoft.com/en-us/microsoft-edge/webview2/webview2-api-reference
https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32
