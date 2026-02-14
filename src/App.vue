<script setup>
import { ref, onMounted, computed } from 'vue'

// State management
const opened = ref(false)
const questName = ref('')
const step = ref(1)
const audio = ref(null)
const selectedImg = ref(null)
// eslint-disable-next-line no-unused-vars
const showSaveDate = ref(true)
// eslint-disable-next-line no-unused-vars
const showEventDate = ref(false)

// Visibility tracking
const visibleElements = ref({
  mainTitle: false,
  subtitle: false,
  parentsNames: false,
  mainCard: false,
  invitationTitle: false,
  invitationText: false,
  coupleNames: false,
  dateInfo: false,
  locationInfo: false,
  detailButton: false,
  timelineSection: false,
  gallerySection: false
})

const timelineHeaderVisible = ref(false)
const galleryTitleVisible = ref(false)
const visibleItems = ref({})
const visibleGalleryItems = ref({})
const countdown = ref({ days: '00', hours: '00', minutes: '00', seconds: '00' })
// eslint-disable-next-line no-unused-vars
let countdownTimer = null
const rsvpStatus = ref('yes')
const rsvpMessage = ref('')
const locale = ref('km')
const isEnglish = computed(() => locale.value === 'en')

const switchLocale = (nextLocale) => {
  locale.value = nextLocale
}

const telegramRsvpUrl = computed(() => {
  const base = 'https://t.me/Chanpharath'
  const statusText = rsvpStatus.value === 'yes'
    ? (isEnglish.value ? 'Can join' : 'អាចចូលរួម')
    : (isEnglish.value ? 'Cannot join' : 'មិនអាចចូលរួម')
  const name = questName.value?.trim() ? questName.value.trim() : (isEnglish.value ? 'Guest' : 'ភ្ញៀវ')
  const message = rsvpMessage.value.trim()
  const fullText = message
    ? `RSVP - ${name}: ${statusText}. Message: ${message}`
    : `RSVP - ${name}: ${statusText}.`
  return `${base}?text=${encodeURIComponent(fullText)}`
})

// Refs for scroll animations
const timelineRefs = ref([])
const galleryRefs = ref([])

// Data
// eslint-disable-next-line no-unused-vars
const openMap = () => {
  window.open('https://maps.app.goo.gl/dG6MqsvsTbBiemTZ9?g_st=ic', '_blank')
}

const images = [
  { id: 1, url: '/image/p1.jpg', alt: 'Image 1' },
  { id: 2, url: '/image/p2.jpg', alt: 'Image 2' },
  { id: 3, url: '/image/p3.jpg', alt: 'Image 3' },
  { id: 4, url: '/image/p4.jpg', alt: 'Image 4' },
  { id: 5, url: '/image/p5.jpg', alt: 'Image 5' },
  { id: 6, url: '/image/p6.jpg', alt: 'Image 6' },
  { id: 7, url: '/image/p7.jpg', alt: 'Image 7' },
  { id: 8, url: '/image/p8.jpg', alt: 'Image 8' },
  { id: 9, url: '/image/p9.jpg', alt: 'Image 9' },
  { id: 10, url: '/image/p10.jpg', alt: 'Image 10' },
  { id: 11, url: '/image/p11.jpg', alt: 'Image 11' },
  { id: 12, url: '/image/p12.jpg', alt: 'Image 12' },
  { id: 13, url: '/image/p13.jpg', alt: 'Image 13' },
  { id: 14, url: '/image/p14.jpg', alt: 'Image 14' }
]


const timelineEventsKm = [
  { icon: "/icon/ev1.png", title: "ពិធីសែនក្រុងពាលី", time: "ម៉ោង ០៦ : ០០ នាទីព្រឹក" },
  { icon: "/icon/ev2.png", title: "ជួបជុំភ្ញៀវកិត្តិយសរៀបចំពិធីហែជំនូន", time: "ម៉ោង ០៦ : ៤០ នាទីព្រឹក" },
  { icon: "/icon/ev9.png", title: "ពិធីហែជំនូន(កំណត់)ចូលរោងជ័យ", time: "ម៉ោង ០៧ : ១០ នាទីព្រឹក" },
  { icon: "/icon/ev3.png", title: "ពិធីពិសារស្លាកំណត់ និងព្រេនផ្លែឈើ ", time: "ម៉ោង ០៧ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev4.png", title: "ពិធីបំពាក់ចិញ្ចៀន និងអញ្ជើញភ្ញៀវកិត្តិយសពិសារអាហារពេលព្រឹក", time: "ម៉ោង ៨ : ០០ នាទីព្រឹក" },
  { icon: "/icon/ev1.png", title: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត", time: "ម៉ោង ០៨ : ៤០ នាទីព្រឹក" },
  { icon: "/icon/ev5.png", title: "ពិធីកាត់សក់បង្កក់សិរី", time: "ម៉ោង ៩ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev6.png", title: "ពិធីសំពះពេលា បង្វិលពពិល សំពះផ្ទឹម និងពិធីសែនចងដៃ", time: "ម៉ោង ១១ : ០០ នាទីព្រឹក" },
  { icon: "/icon/ev7.png", title: "អញ្ញើញភ្ញៀវកិត្តិយសពិសាអាហារថ្ងៃត្រង់", time: "ម៉ោង ១១ : ៣០ ថ្ងៃត្រង់" },
  { icon: "/icon/ev8.png", title: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយសពិសារ ភោជនាអាហារដោយមេត្រីភាព", time: "ម៉ោង ០៥ : ០០​ ល្ងាច" }
]

const timelineEventsEn = [
  { icon: "/icon/ev2.png", title: "Guest arrival and welcome", time: "06:00 AM" },
  { icon: "/icon/ev9.png", title: "Ceremony opening", time: "07:00 AM" },
  { icon: "/icon/ev3.png", title: "Blessing and breakfast", time: "07:30 AM" },
  { icon: "/icon/ev4.png", title: "Ring exchange", time: "08:30 AM" },
  { icon: "/icon/ev5.png", title: "Hair cutting ritual", time: "09:30 AM" },
  { icon: "/icon/ev6.png", title: "Traditional blessing ritual", time: "10:30 AM" },
  { icon: "/icon/ev7.png", title: "Lunch reception", time: "11:30 AM" },
  { icon: "/icon/ev8.png", title: "Evening reception", time: "05:00 PM" }
]

const timelineEvents = computed(() => (isEnglish.value ? timelineEventsEn : timelineEventsKm))

// Computed
const getGalleryItemClass = (index) => {
  // 2-1-2-1 pattern: two half-width cards, then one full-width card.
  return index % 3 === 2 ? 'col-span-12' : 'col-span-6'
}

// Methods
const openInvitation = () => {
  audio.value = new Audio('/songs/song.mp3')
  audio.value.play().catch(err => console.log('Audio play failed:', err))

  opened.value = true

  // Jump straight to step 2 (Main Invitation)
  step.value = 2

  // Ensure DOM is ready before setting up observers
  setTimeout(() => {
    setupScrollObservers()
  }, 100)
}

const closeLightbox = () => {
  selectedImg.value = null
}

const setTimelineRef = (el, index, type) => {
  if (el) {
    if (!timelineRefs.value[index]) {
      timelineRefs.value[index] = {}
    }
    timelineRefs.value[index][type] = el
  }
}

const setGalleryRef = (el, index) => {
  if (el) {
    galleryRefs.value[index] = el
  }
}

const createObserver = (callback, threshold = 0.2) => {
  return new IntersectionObserver(callback, {
    threshold,
    // Use viewport root since content is no longer inside an inner scroll container.
    root: null,
    rootMargin: '0px 0px -50px 0px'
  })
}

const setupScrollObservers = () => {
  // Small delay to ensure DOM is fully rendered
  setTimeout(() => {
    // Immediately show all main elements
    Object.keys(visibleElements.value).forEach(key => {
      visibleElements.value[key] = true
    })

    timelineHeaderVisible.value = true
    galleryTitleVisible.value = true

    // Observe main elements for future interactions
    const elementKeys = [
      'mainTitle', 'subtitle', 'parentsNames', 'mainCard',
      'invitationTitle', 'invitationText', 'coupleNames',
      'dateInfo', 'locationInfo', 'detailButton',
      'timelineSection', 'gallerySection'
    ]

    elementKeys.forEach(key => {
      const element = document.querySelector(`[data-ref="${key}"]`)
      if (element) {
        const observer = createObserver(([entry]) => {
          if (entry.isIntersecting) {
            visibleElements.value[key] = true
          }
        })
        observer.observe(element)
      }
    })

    // Observe timeline header
    const timelineHeader = document.querySelector('[data-ref="timelineHeader"]')
    if (timelineHeader) {
      const observer = createObserver(([entry]) => {
        if (entry.isIntersecting) timelineHeaderVisible.value = true
      })
      observer.observe(timelineHeader)
    }

    // Observe gallery title
    const galleryTitle = document.querySelector('[data-ref="galleryTitle"]')
    if (galleryTitle) {
      const observer = createObserver(([entry]) => {
        if (entry.isIntersecting) galleryTitleVisible.value = true
      })
      observer.observe(galleryTitle)
    }

    // Observe timeline items with staggered animation
    timelineRefs.value.forEach((refs, index) => {
      if (refs?.icon) {
        const observer = createObserver(([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              visibleItems.value[index] = true
            }, index * 100)
          }
        })
        observer.observe(refs.icon)
      }
    })

    // Observe gallery items with staggered animation
    galleryRefs.value.forEach((el, index) => {
      if (el) {
        const observer = createObserver(([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              visibleGalleryItems.value[index] = true
            }, index * 100)
          }
        })
        observer.observe(el)
      }
    })
  }, 100)
}

// Lifecycle
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const nameParam = urlParams.get('name')
  if (nameParam) {
    questName.value = decodeURIComponent(nameParam)
  }

  const targetDate = new Date('2026-03-12T06:00:00')

  const toKhmerDigits = (value) => {
    const map = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
    return String(value).replace(/\d/g, (d) => map[d])
  }

  const updateCountdown = () => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()
    if (diff <= 0) {
      countdown.value = { days: '០០', hours: '០០', minutes: '០០', seconds: '០០' }
      return
    }

    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad2 = (n) => String(n).padStart(2, '0')
    countdown.value = {
      days: toKhmerDigits(days),
      hours: toKhmerDigits(pad2(hours)),
      minutes: toKhmerDigits(pad2(minutes)),
      seconds: toKhmerDigits(pad2(seconds))
    }
  }

  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})
</script>

<template>
  <div id="app">
    <div class="lang-switcher">
      <button type="button" :class="['lang-switcher__btn', locale === 'km' ? 'is-active' : '']"
        @click="switchLocale('km')">KH</button>
      <button type="button" :class="['lang-switcher__btn', locale === 'en' ? 'is-active' : '']"
        @click="switchLocale('en')">EN</button>
    </div>

    <!-- Landing Section -->
    <section v-if="!opened" class="landing">
      <div class="min-h-screen w-full flex flex-col bg-[#344125] justify-start px-4">
        <div class="fixed inset-0 z-0">
          <img src="/image/cover.jpg" class="w-full h-full object-contain" alt="Background" />
          <!-- Floral overlays -->
          <!-- <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-left" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-right" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-left-angle" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-right-angle" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom-left" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom-right" aria-hidden="true" /> -->
          <!-- <video autoplay muted loop playsinline class="w-full h-full object-cover"> -->
          <!-- <source src="/icon/vdo.mp4" type="video/mp4" /> -->
          <!-- </video> -->
        </div>
        <!-- Butterflies (behind content) -->
        <div class="butterfly-layer" aria-hidden="true">
          <span class="butterfly butterfly--1"></span>
          <span class="butterfly butterfly--2"></span>
          <span class="butterfly butterfly--3"></span>
          <span class="butterfly butterfly--4"></span>
          <span class="butterfly butterfly--5"></span>
          <span class="butterfly butterfly--6"></span>
          <span class="butterfly butterfly--7"></span>
          <span class="butterfly butterfly--8"></span>
        </div>

        <div class="relative z-10 flex flex-col justify-center pt-20 items-center text-center">
          <div class="absolute inset-0  pointer-events-none"></div>
          <!-- <h1 class="text-2xl md:text-2xl font-moul leading-relaxed lg:text-4xl text-[#7B1F2A] text-center py-2"> -->
          <h1 class="text-lg brown-text mt-10 sm:text-xl whitespace-nowrap font-moul m p-3 sm:p-4 rounded-lg">
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h1>
          <img src="/image/logo.png" alt="Ornament" class="w-50 mb-8" />
          <h3 class="text-lg md:text-xl mt-10 font-moul leading-relaxed lg:text-xl mb-4 brown-text text-center">
            សូមគោរពអញ្ជើញ
          </h3>
          <div class="guest-name-tag mb-8">
            <img src="/image/name-tag.png" alt="" aria-hidden="true" class="guest-name-tag__bg" />
            <p class="guest-name-tag__text font-moul brown-text text-base">
              {{ questName }}
            </p>
          </div>
          <button class="relative w-50 h-20 bg-contain bg-no-repeat bg-center
              flex items-center justify-center
              brown-text text-lg
              hover:scale-105 transition-all duration-500 active:scale-95
              animate-pulse-blob"
            style="background-image: url('/icon/button-outline.png')" @click="openInvitation"
            :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif'}">
            {{ isEnglish ? 'Open Invitation' : 'បើកធៀប' }}
          </button>

        </div>
      </div>
    </section>

    <!-- Main Invitation -->
    <section v-if="opened && step === 2" class="invitation">
      <div class="relative min-h-screen w-full flex flex-col items-center">
        <!-- Floral overlays -->
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-left" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-right" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-left-angle" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top-right-angle" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom-left" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom-right" aria-hidden="true" />

        <!-- Background -->
        <div class="fixed inset-0 z-0 bg-[#344125]">
          <img src="/image/pattern.jpg" class="w-full h-full object-contain pattern-bg-image" alt="Background" />
          <!-- <video autoplay muted loop playsinline class="w-full h-full object-cover">
            <source src="/icon/vdo.mp4" type="video/mp4" />
          </video> -->
        </div>

        <!-- Butterflies (behind content) -->
        <div class="butterfly-layer" aria-hidden="true">
          <span class="butterfly butterfly--1"></span>
          <span class="butterfly butterfly--2"></span>
          <span class="butterfly butterfly--3"></span>
          <span class="butterfly butterfly--4"></span>
          <span class="butterfly butterfly--5"></span>
          <span class="butterfly butterfly--6"></span>
          <span class="butterfly butterfly--7"></span>
          <span class="butterfly butterfly--8"></span>
        </div>

        <!-- Content -->
        <div class="relative z-10 w-full px-8 flex flex-col justify-center pt-15 items-center text-center">

          <!-- Glass Card -->
          <!-- <div class="relative w-full max-w-md h-[85vh]
            bg-[#c49850]
            rounded-3xl md:rounded-[2.5rem]
            border-4 border-white shadow-2xl
            flex flex-col overflow-hidden"> -->
          <div class="relative w-full max-w-md">
            <div class="w-full pt-10">
              <!-- <div class="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div> -->
              <h1 data-ref="mainTitle" :class="['brown-text text-lg md:text-xl mt-5 mb-8 font-moul leading-relaxed lg:text-xl text-center py-2 transition-all duration-1000 delay-100',
                visibleElements.mainTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h1>

              <div data-ref="parentsNames" :class="['brown-text text-primary whitespace-nowrap grid grid-cols-2 gap-2 font-moul leading-relaxed mb-4 text-center max-w-md transition-all duration-1000 delay-200',
                visibleElements.parentsNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                <div class="grid grid-rows-2 gap-2 text-left">
                  <div>
                    <span class="font-metal ">លោកស្រី </span>
                    <span>ស្រី ស៊ីណា</span>
                  </div>

                </div>
                <div class="grid grid-rows-2 text-right">
                  <div>
                    <span class="font-metal">លោក </span>
                    <span>ជា សឹង្ហវុធ</span>
                  </div>
                  <div>
                    <span class="font-metal">លោកស្រី </span>
                    <span class="text-sm">ឡុង សុត្ថាម៉ាឡា</span>
                  </div>
                </div>
              </div>

              <div data-ref="mainCard" :class="['transition-all duration-1000 delay-300',
                visibleElements.mainCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">

                <h3 data-ref="invitationTitle" :class="['brown-text text-lg md:text-lg leading-relaxed lg:text-lg mt-12 mb-4 text-center transition-all duration-1000 delay-400',
                  visibleElements.invitationTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  {{ isEnglish ? 'Respectfully Invited' : 'មានកិត្តិយសសូមគោរពអញ្ជើញ' }}
                </h3>

                <p v-if="isEnglish" data-ref="invitationText" :class="['brown-text font-nokora leading-loose mb-4 transition-all duration-1000 delay-500',
                  visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  We are honored to invite you to join us as respected guests and share your blessings on our wedding
                  ceremony.
                </p>

                <p v-else data-ref="invitationText" :class="['green-text font-metal leading-loose mb-4 transition-all duration-1000 delay-500',
                  visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  សម្តេច ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា អញ្ជើញចូលរួមជាអធិបតី
                  និងជាភ្ញៀវកិត្តិយសដើម្បីប្រសិទ្ធិពរជ័យ សិរីសួស្តីជ័យមង្គលក្នុងកម្មវិធីរៀបមង្គលអាពាហ៍ពិពាហ៍
                  កូនប្រុស-កូនស្រី របស់យើងខ្ញុំ
                </p>

                <div data-ref="coupleNames" :class="['grid grid-cols-2 gap-2 mb-5 font-moul leading-relaxed mt-10 text-center max-w-md transition-all duration-1000 delay-600',
                  visibleElements.parentsNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <p class="brown-text font-moulpali">កូនប្រុសនាម</p>
                  <p class="brown-text font-moulpali">កូនស្រីនាម</p>
                </div>

                <h2 data-ref="coupleNames" :class="['brown-text font-moul text-base leading-relaxed lg:text-xl mb-10 text-center flex items-center justify-center gap-4 transition-all duration-1000 delay-700',
                  visibleElements.coupleNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  មាន ចាន់ផារ៉ាត់
                  <img src="/icon/brown-jeaku.png" alt="Logo" class="w-12" />
                  ជា សុត្ថាចន្ធីម៉ា
                </h2>

                <div data-ref="dateInfo" :class="['transition-all duration-1000 delay-800',
                  visibleElements.dateInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  <p class="brown-text text-xl md:text-2xl mb-3">
                    {{ isEnglish ? 'Thursday' : 'ថ្ងៃព្រហស្បតិ៍ ៩រោច ខែផល្គុន' }}
                  </p>
                  <div class="w-32 h-1 bg-[#c49850]/60 mx-auto mt-5 mb-5"></div>
                  <p class="brown-text text-5xl md:text-6xl">
                    {{ isEnglish ? '12' : '១២' }}
                  </p>
                  <div class="w-32 h-1 bg-[#c49850]/60 mx-auto mt-5 mb-5"></div>
                  <p class="brown-text text-2xl md:text-3xl mb-10">
                    {{ isEnglish ? 'March 2026' : 'មីនា ២០២៦' }}
                  </p>


                </div>

                <!-- <div class="relative w-full max-w-md p-6
                 bg-[#c49850]
                 rounded-3xl md:rounded-[2.5rem]
                 border-4 border-white shadow-2xl
                 flex flex-col overflow-hidden"> -->
                <p data-ref="dateInfo" :class="['green-text font-metal leading-loose transition-all duration-1000 delay-900',
                  visibleElements.dateInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  នៅថ្ងៃព្រហស្បតិ៍ ៩រោច ខែផល្គុន ឆ្នាំម្សាញ់ សប្តស័ក ពុទ្ធសករាជ ២៥៦៩ ត្រូវនឹងថ្ងៃទី ១២
                  ខែមីនា
                  ឆ្នាំ ២០២៦
                </p>

                <p data-ref="locationInfo" :class="['text-base tracking-wider green-text font-moul p-1 leading-loose mb-4 transition-all duration-1000 delay-1000',
                  visibleElements.locationInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <span class="font-metal">វេលាម៉ោង ៥ : ០០ ល្ងាច នៅ </span>
                  <span class="">មជ្ឈមណ្ឌលសន្និបាត និងពិព័រណ៍អន្តរជាតិជ្រោយចង្វារ</span>
                  <span class="font-metal"> OCIC</span>
                  <span class="font-metal"> អគារ G </span>
                </p>
                <!-- <div
                    class="w-full overflow-hidden rounded-2xl border border-white/40 shadow-lg transition-all duration-1000 delay-1100"
                    :class="visibleElements.locationInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3906.697880214546!2d104.88279527584474!3d11.599669143468102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109522e1adbf683%3A0x3f4395cd35ec9617!2sAEON%20Mall%20Sen%20Sok%20City!5e0!3m2!1sen!2skh!4v1770492834601!5m2!1sen!2skh"
                      class="w-full h-60 md:h-72" style="border:0;" allowfullscreen="" loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"></iframe>
                  </div> -->
                <h2 data-ref="timelineHeader" :class="['text-base leading-loose brown-text text-center font-moul p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1200',
                  timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  {{ isEnglish ? 'Countdown' : 'រាប់ថយក្រោយដល់ថ្ងៃពិធី' }}
                </h2>

                <div class="w-full flex justify-center">
                  <div class="grid grid-cols-4 gap-2 sm:gap-3">
                    <div class="min-w-20 sm:min-w-20 text-center ">
                      <div class="text-2xl sm:text-2xl font-moul green-text">{{ countdown.days }}</div>
                      <div class="text-[12px] sm:text-xs font-nokora green-text tracking-wide">ថ្ងៃ</div>
                    </div>
                    <div class="min-w-20 sm:min-w-20 text-center ">
                      <div class="text-2xl sm:text-2xl font-moul green-text">{{ countdown.hours }}</div>
                      <div class="text-[12px] sm:text-xs font-nokora green-text tracking-wide">ម៉ោង</div>
                    </div>
                    <div class="min-w-20 sm:min-w-20 text-center ">
                      <div class="text-2xl sm:text-2xl font-moul green-text">{{ countdown.minutes }}</div>
                      <div class="text-[12px] sm:text-xs font-nokora green-text tracking-wide">នាទី</div>
                    </div>
                    <div class="min-w-20 sm:min-w-20 text-center ">
                      <div class="text-2xl sm:text-2xl font-moul green-text">{{ countdown.seconds }}</div>
                      <div class="text-[12px] sm:text-xs font-nokora green-text tracking-wide">វិនាទី</div>
                    </div>
                  </div>
                </div>

                <!-- </div> -->


                <!-- <div data-ref="detailButton" :class="['mt-6 transition-all duration-1000 delay-900',
                  visibleElements.detailButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <button @click="openMap()" class="group relative z-10 overflow-hidden px-10 py-4 rounded-full
                    backdrop-blur-md bg-white/10 border border-white/40
                    font-nokora font-semibold text-lg
                    shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]
                    hover:bg-white/20 hover:scale-105 transition-all duration-500 active:scale-95">
                    <span class="relative z-10 dust-white-text font-nokora flex items-center gap-2 sm:gap-3">
                      មើលផែនទី
                    </span>
                  </button>
                </div> -->

                <!-- <div data-ref="timelineSection" :class="['relative h-auto mt-8 bg-transparent transition-all duration-1000 delay-1000',
                  visibleElements.timelineSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <img src="/image/e1.JPG" alt="Ornament"
                    class="w-full h-full object-cover -mt-5 bg-transparent rounded-2xl" />

                  <div class="absolute inset-0 flex flex-col justify-between items-center p-4 sm:p-6">
                    <h2 data-ref="timelineHeader" :class="['text-base leading-loose dust-white-text text-center font-moul p-3 sm:p-4 rounded-lg transition-all duration-1000',
                      timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                      រាប់ថយក្រោយដល់ពិធីមង្គលអាពាហ៍ពិពាហ៍
                    </h2>

                    <div class="w-full flex justify-center">
                      <div class="grid grid-cols-4 gap-2 sm:gap-3">
                        <div
                          class="min-w-14 sm:min-w-16 text-center rounded-xl bg-white/15 border border-white/30 px-3 py-2 backdrop-blur-sm">
                          <div class="text-lg sm:text-xl font-moul dust-white-text">{{ countdown.days }}</div>
                          <div class="text-[12px] sm:text-xs font-nokora dust-white-text/90 tracking-wide">ថ្ងៃ</div>
                        </div>
                        <div
                          class="min-w-14 sm:min-w-16 text-center rounded-xl bg-white/15 border border-white/30 px-3 py-2 backdrop-blur-sm">
                          <div class="text-lg sm:text-xl font-moul dust-white-text">{{ countdown.hours }}</div>
                          <div class="text-[12px] sm:text-xs font-nokora dust-white-text/90 tracking-wide">ម៉ោង</div>
                        </div>
                        <div
                          class="min-w-14 sm:min-w-16 text-center rounded-xl bg-white/15 border border-white/30 px-3 py-2 backdrop-blur-sm">
                          <div class="text-lg sm:text-xl font-moul dust-white-text">{{ countdown.minutes }}</div>
                          <div class="text-[12px] sm:text-xs font-nokora dust-white-text/90 tracking-wide">នាទី</div>
                        </div>
                        <div
                          class="min-w-14 sm:min-w-16 text-center rounded-xl bg-white/15 border border-white/30 px-3 py-2 backdrop-blur-sm">
                          <div class="text-lg sm:text-xl font-moul dust-white-text">{{ countdown.seconds }}</div>
                          <div class="text-[12px] sm:text-xs font-nokora dust-white-text/90 tracking-wide">វិនាទី</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->

                <!-- Timeline Section -->
                <div data-ref="timelineSection" :class="['p-6 sm:p-8 md:p-12 bg-transparent transition-all duration-1000 delay-1300',
                  visibleElements.timelineSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <h2 data-ref="timelineHeader" :class="['brown-text text-md text-center whitespace-nowrap font-moul bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1400',
                    timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                    :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                    {{ isEnglish ? 'Wedding Ceremony' : 'កម្មវិធីមង្គលអាពាហ៍ពិពាហ៍' }}
                  </h2>
                  <h2 data-ref="timelineHeader" :class="['brown-text text-base leading-loose text-center font-moul p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1500',
                    timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                    :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                    {{ isEnglish ? 'Thursday, March 12, 2026' : 'កម្មវិធី ថ្ងៃព្រហស្បតិ៍ ទី១២ ខែមីនា ឆ្នាំ២០២៦' }}
                  </h2>

                  <div class="relative">
                    <div
                      class="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-secondary dark:bg-primary/30 h-full">
                    </div>

                    <div class="grid grid-cols-[auto_1fr] gap-x-4 -gap-y-2 text-left">
                      <template v-for="(event, index) in timelineEvents" :key="index">
                        <div :ref="el => setTimelineRef(el, index, 'icon')" :class="['flex flex-col items-left gap-1 pt-3 relative transition-all duration-700',
                          visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                          <div class="text-primary text-3xl">
                            <img :src="event.icon" alt="event icon"
                              class="w-18 sm:w-12 md:w-16 rounded-xl bg-transparent mix-blend-multiply" />
                          </div>
                          <div class="w-0.5 bg-secondary dark:bg-primary/30 h-2"></div>
                        </div>
                        <div :class="['flex flex-1 flex-col pb-6 pt-2 transition-all duration-700',
                          visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                          <p class="text-text-light font-nokora brown-text text-base font-semibold leading-normal">
                            {{ event.title }}
                          </p>
                          <p class="text-base green-text font-moul leading-normal"
                            :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">{{ event.time }}</p>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Gallery Section -->
                <div data-ref="gallerySection" :class="['relative transition-all duration-1000 delay-1600',
                  visibleElements.gallerySection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <h2 data-ref="galleryTitle" :class="['text-lg sm:text-xl text-center whitespace-nowrap font-moul brown-text bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1700',
                    galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                    :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                    {{ isEnglish ? 'Gallery   ' : 'វិចិត្រសាល' }}
                  </h2>

                  <div class="grid grid-cols-12 gap-4">
                    <div v-for="(img, index) in images" :key="img.id" :ref="el => setGalleryRef(el, index)" :class="['relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-700',
                      getGalleryItemClass(index),
                      visibleGalleryItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                      @click="selectedImg = img.url">
                      <img :src="img.url" :alt="img.alt"
                        class="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                      <div
                        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="text-white font-medium">View Full</span>
                      </div>
                    </div>
                  </div>

                  <Teleport to="body">
                    <transition name="fade">
                      <div v-if="selectedImg"
                        class="fixed inset-0 z-1000 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        @click="closeLightbox">
                        <button class="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
                          @click="closeLightbox">
                          &times;
                        </button>
                        <img :src="selectedImg"
                          class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-all"
                          @click.stop alt="Full size image" />
                        <p class="absolute bottom-6 text-white/60 text-sm">Click anywhere to close</p>
                      </div>
                    </transition>
                  </Teleport>

                </div>
                <h2 data-ref="galleryTitle" :class="['brown-text mt-5 text-lg sm:text-xl text-center whitespace-nowrap font-moul bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                  galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  {{ isEnglish ? 'ABA KHQR' : 'ទទួលចំណងដៃ' }}
                </h2>
                <img src="/image/qr-aba-usd.jpg" alt="QR Code"
                  class="mx-auto my-6 w-48 h-48 object-cover rounded-3xl shadow-lg border border-white/30" />
                  <h2 data-ref="galleryTitle" :class="['brown-text text-lg mt-2 mb-8 sm:text-xl text-center whitespace-nowrap font-sans font-bold bg-white/10 p-1 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                    galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    CHANPHARATH MEAN (ABA KHQR)
                  </h2>


                <h2 data-ref="galleryTitle" :class="['brown-text text-lg sm:text-xl text-center whitespace-nowrap font-moul bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                  galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  {{ isEnglish ? 'Scan to view location' : 'ស្កេនមើលទីតាំងពិធី' }}
                </h2>
                <img src="/icon/qr-code.svg" alt="QR Code"
                  class="mx-auto my-6 w-48 h-48 object-cover rounded-3xl shadow-lg border border-white/30" />

                <!-- <h2 data-ref="galleryTitle" :class="['brown-text text-lg mt-2 mb-8 sm:text-xl text-center whitespace-nowrap font-sans font-bold bg-white/10 p-1 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                  galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  SOKHENG AND KIMSRY
                </h2> -->
                <!-- RSVP Section -->
                <div class="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20 text-left">
                  <h3 class="brown-text text-lg font-sans font-extrabold text-center mb-3"
                    :style="isEnglish ? '' : 'font-family: Khmer OS Battambang, sans-serif'">{{ isEnglish ? 'RSVP' :
                    'បញ្ជាក់ការចូលរួម'
                    }}</h3>
                  <p class="brown-text font-metal leading-loose text-sm text-center mb-4">
                    {{ isEnglish
                      ? 'Please confirm your attendance so we can prepare your seat and reception arrangement.'
                      : 'សូមបញ្ជាក់វត្តមានរបស់អ្នក ដើម្បីឲ្យយើងខ្ញុំអាចរៀបចំការទទួលបានល្អប្រសើរឡើង' }}
                  </p>
                  <div class="flex items-center justify-center gap-4 mb-4">
                    <label :class="[
                      'flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-metal text-sm',
                      rsvpStatus === 'yes'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-emerald-100'
                    ]">
                      <input type="radio" name="rsvp" value="yes" v-model="rsvpStatus" class="hidden" />
                      <span>{{ isEnglish ? 'Can join' : 'អាចចូលរួម' }}</span>
                    </label>

                    <label :class="[
                      'flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-metal text-sm',
                      rsvpStatus === 'no'
                        ? 'border-red-400 bg-red-50 text-red-800 shadow-sm'
                        : 'border-gray-100 bg-white text-gray-500 hover:border-red-100'
                    ]">
                      <input type="radio" name="rsvp" value="no" v-model="rsvpStatus" class="hidden" />
                      <span>{{ isEnglish ? 'Cannot join' : 'មិនអាច' }}</span>
                    </label>
                  </div>
                  <textarea v-model="rsvpMessage" rows="3"
                    :placeholder="isEnglish ? 'Message (optional)' : 'ផ្ញើរសារ (optional)'"
                    class="w-full rounded-lg p-3 text-sm font-metal bg-white/80 text-[#6b4a2f] placeholder-[#6b4a2f]/70 outline-none"></textarea>
                  <a :href="telegramRsvpUrl" target="_blank" rel="noreferrer"
                    class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 bg-[#2AABEE] text-white font-nokora font-semibold transition hover:scale-105 active:scale-95">
                    {{ isEnglish ? 'Send via Telegram' : 'ផ្ញើរតាមតេលេក្រាម' }}<span><svg viewBox="0 0 24 24"
                        aria-hidden="true" class="theab-footer__icon">
                        <path fill="#fff"
                          d="M20.4 5.2 3.7 11.7c-1 .4-.9 1.8.1 2.1l3.7 1.2 1.4 4.3c.2.7 1.1.9 1.6.3l2.2-2.5 4.1 3c.5.4 1.3.1 1.5-.6l2.8-12.3c.2-.9-.6-1.6-1.7-1Z" />
                      </svg></span>
                  </a>
                </div>

                <h3 data-ref="invitationTitle" :class="['brown-text text-lg md:text-lg font-moul leading-relaxed lg:text-lg mb-4 text-center transition-all duration-1000 delay-400',
                  visibleElements.invitationTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                  :style="{ fontFamily: isEnglish ? 'Cinzel, serif' : 'Moul, serif' }">
                  {{ isEnglish ? 'Thanks and Apology' : 'សេចក្ដីថ្លែងអំណរគុណ និងសូមអភ័យទោស' }}
                </h3>

                <p v-if="isEnglish" data-ref="invitationText" :class="['brown-text font-metal leading-loose mb-4 transition-all duration-1000 delay-500',
                  visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  We deeply thank you for joining our ceremony. If there is any mistake in our invitation wording or
                  guest listing, we
                  sincerely ask for your understanding and forgiveness.
                </p>

                <p v-else data-ref="invitationText" :class="['brown-text font-metal leading-loose mb-4 transition-all duration-1000 delay-500',
                  visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  យើងខ្ញុំសូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការអញ្ជើញចូលរួមជា ភ្ញៀវកិត្តិយស ក្នុងពិធីរបស់យើងខ្ញុំ
                  និងសូមខន្តីអភ័យទោសដោយពុំបានអញ្ជើញ
                  ដោយផ្ទាល់ និងការសរសេរឈ្មោះរបស់ភ្ញៀវកិត្តិយសមិនបានត្រឹមត្រូវ ឫពុំបានសេសេរឈ្មោះ ។
                  សូមជូនពរ ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និងភ្ញៀវកិត្តិយសទាំងអស់
                  សិរីសួស្តីជ័យមង្គល
                  និងទទួលបានជោគជ័យគ្រប់ភារកិច្ច ។
                  សូមអរគុណ និងសូមអភ័យទោសម្ដងទៀត!
                </p>

                <!-- Footer -->
                <footer class="theab-footer mt-10 mb-25">
                  <div class="theab-footer__brand">
                    <div class="theab-footer__logo">
                      <img src="/icon/theab-icon.jpg" alt="TheabStudio logo" class="theab-footer__logo-img" />
                    </div>
                    <div class="theab-footer__text">
                      <span class="theab-footer__title">{{ isEnglish ? 'Made by' : 'បង្កើតដោយ' }}</span>
                      <span class="theab-footer__name">TheabStudio</span>
                    </div>
                  </div>

                  <div class="theab-footer__social">
                    <a class="theab-footer__btn" href="https://www.facebook.com/share/1AVegr6kjM/?mibextid=wwXIfr"
                      target="_blank" rel="noreferrer" aria-label="TheabStudio on Facebook">
                      <svg viewBox="0 0 24 24" aria-hidden="true" class="theab-footer__icon">
                        <path fill="currentColor"
                          d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V12H8v3h2v6h3v-6h2.2l.3-3H13v-2.1c0-.5.4-.9.9-.9Z" />
                      </svg>
                    </a>
                    <a class="theab-footer__btn"
                      href="https://www.instagram.com/theab.studio?igsh=MTA2cjNkZzRodWw4ag%3D%3D&utm_source=qr"
                      target="_blank" rel="noreferrer" aria-label="TheabStudio on Instagram">
                      <svg viewBox="0 0 24 24" aria-hidden="true" class="theab-footer__icon">
                        <path fill="currentColor"
                          d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm7.1-.8a4.5 4.5 0 0 0-2.6-2.6c-1-.4-2.1-.5-4.5-.5s-3.5.1-4.5.5a4.5 4.5 0 0 0-2.6 2.6c-.4 1-.5 2.1-.5 4.5s.1 3.5.5 4.5a4.5 4.5 0 0 0 2.6 2.6c1 .4 2.1.5 4.5.5s3.5-.1 4.5-.5a4.5 4.5 0 0 0 2.6-2.6c.4-1 .5-2.1.5-4.5s-.1-3.5-.5-4.5ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm5.2-9.1a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                      </svg>
                    </a>
                    <a class="theab-footer__btn" href="https://t.me/nar0th" target="_blank" rel="noreferrer"
                      aria-label="TheabStudio on Telegram">
                      <svg viewBox="0 0 24 24" aria-hidden="true" class="theab-footer__icon">
                        <path fill="currentColor"
                          d="M20.4 5.2 3.7 11.7c-1 .4-.9 1.8.1 2.1l3.7 1.2 1.4 4.3c.2.7 1.1.9 1.6.3l2.2-2.5 4.1 3c.5.4 1.3.1 1.5-.6l2.8-12.3c.2-.9-.6-1.6-1.7-1Z" />
                      </svg>
                    </a>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>

        <!-- Outer Frame Overlay -->
        <!-- <div class="fixed inset-0 z-20 pointer-events-none">
          <img src="/image/frame.png" class="w-full h-full object-contain" alt="" aria-hidden="true" />
        </div> -->
      </div>
    </section>
  </div>
</template>

<style scoped>
.gold-text {
  background: linear-gradient(to bottom, #FFED4E 0%, #FFD700 40%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter:
    drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4)) drop-shadow(0 2px 4px rgba(36, 29, 29, 0.3)) drop-shadow(0 0 12px rgba(241, 214, 59, 0.5));
}

.brown-text {
  color: #b88c4f;
}

.green-text {
  color: #344125;
}

.guest-name-tag {
  position: relative;
  width: min(88vw, 360px);
}

.guest-name-tag__bg {
  width: 100%;
  height: auto;
  display: block;
}

.guest-name-tag__text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding-inline: 1.25rem;
  font-size: clamp(1rem, 2.8vw, 1.35rem);
  letter-spacing: 0.02em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dust-white-text {
  color: #fcf4f4;
  /* Your specific color */

  /* Layer 1: Sharp dark outline (0.8 opacity) for immediate legibility
    Layer 2: Soft dark spread to create depth against the flowers
    Layer 3: Subtle dark-brown glow to anchor the yellow tones
  */
  filter:
    drop-shadow(0 2px 2px rgba(0, 0, 0, 0.8))
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-fade-enter-active {
  transition: opacity 0.8s ease;
}

.text-fade-leave-active {
  transition: opacity 0.8s ease;
}

.text-fade-enter-from {
  opacity: 0;
}

.text-fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delay-100 {
  transition-delay: 100ms;
}

.delay-150 {
  transition-delay: 150ms;
}

.delay-200 {
  transition-delay: 200ms;
}

.delay-300 {
  transition-delay: 300ms;
}

.delay-400 {
  transition-delay: 400ms;
}

.delay-500 {
  transition-delay: 500ms;
}

.delay-600 {
  transition-delay: 600ms;
}

.delay-700 {
  transition-delay: 700ms;
}

.delay-800 {
  transition-delay: 800ms;
}

.delay-900 {
  transition-delay: 900ms;
}

.delay-1000 {
  transition-delay: 1000ms;
}

.delay-1100 {
  transition-delay: 1100ms;
}

.delay-1200 {
  transition-delay: 1200ms;
}

.delay-1300 {
  transition-delay: 1300ms;
}

.delay-1400 {
  transition-delay: 1400ms;
}

.delay-1500 {
  transition-delay: 1500ms;
}

.delay-1600 {
  transition-delay: 1600ms;
}

.delay-1700 {
  transition-delay: 1700ms;
}

.delay-1800 {
  transition-delay: 1800ms;
}

.theab-footer {
  margin-top: 2.5rem;
  padding: 1.25rem 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.12));
  border-radius: 1.5rem;
}

.theab-footer__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theab-footer__logo {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #c49850;
  background: #c49850;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
  font-family: "Cinzel Decorative", serif;
}

.theab-footer__logo-img {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
}

.theab-footer__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.theab-footer__title {
  font-size: 0.8rem;
  color: #c49850;
  font-family: "Nokora", serif;
}

.theab-footer__name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #c49850;
  letter-spacing: 0.04em;
  font-family: "Cinzel", serif;
}

.theab-footer__social {
  display: flex;
  gap: 0.6rem;
}

.theab-footer__btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #f8e8b2;
  border: 1px solid #c49850;
  background: rgba(255, 255, 255, 0.08);
  transition: transform 200ms ease, background 200ms ease, color 200ms ease;
}

.theab-footer__btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.theab-footer__icon {
  width: 20px;
  height: 20px;
  color: #c49850;
}

.lang-switcher {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 40;
  display: flex;
  gap: 0.35rem;
  padding: 0.3rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
}

.lang-switcher__btn {
  border: none;
  min-width: 42px;
  height: 34px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #7B1F2A;
  background: transparent;
  cursor: pointer;
  transition: background 180ms ease, color 180ms ease;
}

.lang-switcher__btn.is-active {
  background: #7B1F2A;
  color: #fff;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.butterfly-layer {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}

.butterfly {
  position: absolute;
  width: 36px;
  height: 28px;
  opacity: 0.7;
  animation: butterfly-fly 18s linear infinite;
}

.butterfly::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 48'%3E%3Cpath fill='%23ffd37a' d='M32 24c-3-6-10-14-20-14C5 10 1 17 4 23c3 7 12 8 19 7-2 7-1 15 9 15s11-8 9-15c7 1 16 0 19-7 3-6-1-13-8-13-10 0-17 8-20 14z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
  animation: butterfly-flap 1.3s ease-in-out infinite;
}

@keyframes butterfly-flap {

  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(0.65);
  }
}

@keyframes butterfly-fly {
  0% {
    transform: translate(-10vw, 10vh) rotate(5deg);
  }

  50% {
    transform: translate(55vw, -10vh) rotate(-8deg);
  }

  100% {
    transform: translate(110vw, 15vh) rotate(10deg);
  }
}

.butterfly--1 {
  top: 15vh;
  left: -10vw;
  animation-duration: 16s;
}

.butterfly--2 {
  top: 35vh;
  left: -25vw;
  animation-duration: 20s;
  animation-delay: -4s;
}

.butterfly--3 {
  top: 60vh;
  left: -20vw;
  animation-duration: 22s;
  animation-delay: -8s;
}

.butterfly--4 {
  top: 75vh;
  left: -35vw;
  animation-duration: 18s;
  animation-delay: -2s;
}

.butterfly--5 {
  top: 10vh;
  left: -40vw;
  animation-duration: 24s;
  animation-delay: -10s;
}

.butterfly--6 {
  top: 45vh;
  left: -30vw;
  animation-duration: 19s;
  animation-delay: -6s;
}

.butterfly--7 {
  top: 70vh;
  left: -15vw;
  animation-duration: 21s;
  animation-delay: -12s;
}

.butterfly--8 {
  top: 25vh;
  left: -50vw;
  animation-duration: 23s;
  animation-delay: -14s;
}

.floral-overlay {
  position: fixed;
  width: min(58vw, 320px);
  height: 22vh;
  object-fit: contain;
  z-index: 20;
  pointer-events: none;
  will-change: transform;
  transform-origin: center;
}

.floral-overlay--top-left {
  top: -70px;
  left: -18px;
  transform: rotate(180deg);
  animation: floral-wind-top-left 9s ease-in-out infinite;
}

.floral-overlay--top-right {
  top: -70px;
  right: -18px;
  transform: rotate(180deg) scaleX(-1);
  animation: floral-wind-top-right 9.8s ease-in-out infinite -1.2s;
}

.floral-overlay--top-left-angle {
  top: -58px;
  left: -64px;
  transform: rotate(135deg);
  animation: floral-wind-top-left-angle 8.8s ease-in-out infinite -0.6s;
}

.floral-overlay--top-right-angle {
  top: -58px;
  right: -64px;
  transform: rotate(-135deg);
  animation: floral-wind-top-right-angle 8.6s ease-in-out infinite -1.7s;
}

.floral-overlay--bottom-left {
  bottom: -70px;
  left: -18px;
  height: 28vh;
  animation: floral-wind-bottom-left 10.5s ease-in-out infinite -0.8s;
}

.floral-overlay--bottom-right {
  bottom: -70px;
  right: -18px;
  height: 28vh;
  transform: scaleX(-1);
  animation: floral-wind-bottom-right 10.9s ease-in-out infinite -2.1s;
}

@keyframes floral-wind-top-left {

  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(180deg);
  }

  25% {
    transform: translate3d(6px, -4px, 0) rotate(183deg);
  }

  50% {
    transform: translate3d(-4px, 3px, 0) rotate(178deg);
  }

  75% {
    transform: translate3d(5px, -2px, 0) rotate(182deg);
  }
}

@keyframes floral-wind-top-right {

  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(180deg) scaleX(-1);
  }

  25% {
    transform: translate3d(-6px, -4px, 0) rotate(177deg) scaleX(-1);
  }

  50% {
    transform: translate3d(4px, 3px, 0) rotate(182deg) scaleX(-1);
  }

  75% {
    transform: translate3d(-5px, -2px, 0) rotate(178deg) scaleX(-1);
  }
}

@keyframes floral-wind-top-left-angle {

  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(135deg);
  }

  25% {
    transform: translate3d(7px, -3px, 0) rotate(139deg);
  }

  50% {
    transform: translate3d(-5px, 4px, 0) rotate(131deg);
  }

  75% {
    transform: translate3d(6px, -2px, 0) rotate(137deg);
  }
}

@keyframes floral-wind-top-right-angle {

  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-135deg);
  }

  25% {
    transform: translate3d(-7px, -3px, 0) rotate(-139deg);
  }

  50% {
    transform: translate3d(5px, 4px, 0) rotate(-131deg);
  }

  75% {
    transform: translate3d(-6px, -2px, 0) rotate(-137deg);
  }
}

@keyframes floral-wind-bottom-left {

  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  25% {
    transform: translate3d(5px, -5px, 0) rotate(3deg);
  }

  50% {
    transform: translate3d(-4px, 4px, 0) rotate(-2deg);
  }

  75% {
    transform: translate3d(4px, -3px, 0) rotate(2deg);
  }
}
@keyframes pulseBlob {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.animate-pulse-blob {
  animation: pulseBlob 2.5s ease-in-out infinite;
}



@keyframes floral-wind-bottom-right {

  0%,
  100% {
    transform: translate3d(0, 0, 0) scaleX(-1);
  }

  25% {
    transform: translate3d(-5px, -5px, 0) rotate(-3deg) scaleX(-1);
  }

  50% {
    transform: translate3d(4px, 4px, 0) rotate(2deg) scaleX(-1);
  }

  75% {
    transform: translate3d(-4px, -3px, 0) rotate(-2deg) scaleX(-1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .floral-overlay {
    animation: none !important;
  }
}


.invitation {
  min-height: 100vh;
  overflow-x: hidden;
}

@media (max-width: 640px) {
  .pattern-bg-image {
    object-fit: cover;
    transform: scale(1.06);
    transform-origin: center;
  }

  .theab-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>
