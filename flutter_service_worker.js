'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "a497c10c02db039dac7080bfb8498266",
"assets/assets/fonts/Raleway/Raleway-Bold.ttf": "7802d8b27fcb19893ce6b38c0789268e",
"assets/assets/fonts/Raleway/Raleway-Medium.ttf": "2ec8557460d3a2cd7340b16ac84fce32",
"assets/assets/fonts/Raleway/Raleway-Regular.ttf": "75b4247fdd3b97d0e3b8e07b115673c2",
"assets/assets/fonts/Raleway/Raleway-SemiBold.ttf": "8a192102b50118c45033e53ce897f103",
"assets/assets/icons/behance-alt.svg": "5c5cb1c76f9e70c3906f061365fdac19",
"assets/assets/icons/demo.png": "3b1486dee654f79124662daad209dbf3",
"assets/assets/icons/desin.svg": "3d83f545f7d806cf7775cb1c3c04db23",
"assets/assets/icons/facebook.svg": "4ce7ccbae633d7ba400b29acf0196933",
"assets/assets/icons/feather_dribbble.svg": "89b806ce6cc9dea635b81d7dc2406352",
"assets/assets/icons/feather_message-square.svg": "5194a360f12626cb541cc80f58c4f217",
"assets/assets/icons/feather_search.svg": "9d58d567fd606a3fdf19583f8685523d",
"assets/assets/icons/feather_share-2.svg": "2eadf3eff1fb945866235c94ec30915d",
"assets/assets/icons/feather_thumbs-up.svg": "a066c16fa33209a18b5282c40da1cf78",
"assets/assets/icons/feather_twitter.svg": "3a254ce88e725b0169c202752364535e",
"assets/assets/icons/icon22.png": "d36a2ce5baafee2cc8fc12a9a2f261b7",
"assets/assets/icons/logo.svg": "c9931bc4e93cda3b203dae019b85688e",
"assets/assets/icons/outube.svg": "83e5ff838b36eace56baab2fef1523a4",
"assets/assets/icons/ssid.png": "5d88d8e0211783d74cfba24865927249",
"assets/assets/images/0.png": "9764fc4eb9b8903140c321cb478401c3",
"assets/assets/images/1.png": "a4db2dc609cd22aa297dc0d3159d71e0",
"assets/assets/images/2.png": "1fdb7c800008fbb0a8f92e2a00574672",
"assets/assets/images/img1.jpg": "6fbedf14589e29547e09a552b08c7eca",
"assets/assets/images/img2.jpg": "ea733f35ff8411c66f491b12cf61e3d8",
"assets/assets/images/img3.jpg": "d51d91c71ddb999fb110ff0dc0d73939",
"assets/assets/images/recent_1.png": "f78101e229ed5405aadad3ba5dc83902",
"assets/assets/images/recent_2.png": "a567a0e447c13f94acf9b1eec0923b55",
"assets/FontManifest.json": "bf62cde7a3fa16514d18c3043623faf9",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "ac453243b78c6caa8569a6f7517b5386",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "43fa9e17039a625450b6aba93baf521e",
"canvaskit/canvaskit.wasm": "04ed3c745ff1dee16504be01f9623498",
"canvaskit/profiling/canvaskit.js": "f3bfccc993a1e0bfdd3440af60d99df4",
"canvaskit/profiling/canvaskit.wasm": "a9610cf39260f60fbe7524a785c66101",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "cd7b6aa8fc9b3290e764ed216503b14b",
"/": "cd7b6aa8fc9b3290e764ed216503b14b",
"main.dart.js": "488fbad97b7b7bddbf7616801bea3750",
"manifest.json": "a5cd325049eaa0efc364047eba6aa499",
"version.json": "1fc6cd3d6721f8a5c96933825134dd0b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
