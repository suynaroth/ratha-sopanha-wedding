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

const telegramRsvpUrl = computed(() => {
  const base = 'https://t.me/sokheng_ouch'
  const statusText = rsvpStatus.value === 'yes' ? 'Can join' : 'Cannot join'
  const name = questName.value?.trim() ? questName.value.trim() : 'Guest'
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
  { id: 1, url: '/image/p4.JPG', alt: 'Image 1' },
  // { id: 2, url: '/image/e2.JPG', alt: 'Image 2' },
  { id: 3, url: '/image/p5.JPG', alt: 'Image 3' },
  { id: 4, url: '/image/n1.JPG', alt: 'Image 4' },
  { id: 5, url: '/image/n2.JPG', alt: 'Image 5' },
  { id: 6, url: '/image/n3.JPG', alt: 'Image 6' },
  { id: 7, url: '/image/p01.jpg', alt: 'Image 7' },
  { id: 8, url: '/image/p02.jpg', alt: 'Image 8' },
  { id: 9, url: '/image/p3.JPG', alt: 'Image 9' },
  { id: 10, url: '/image/p6.JPG', alt: 'Image 10' },
  { id: 11, url: '/image/e1.JPG', alt: 'Image 11' },
  { id: 12, url: '/image/e3.JPG', alt: 'Image 12' },

]

const timelineEvents = [
  { icon: "/icon/ev2.png", title: "ជួបជុំភ្ញៀវកិត្តិយសរៀបចំពិធីហែជំនូន", time: "ម៉ោង ០៦ : ០០ នាទីព្រឹក" },
  { icon: "/icon/ev9.png", title: "ពិធីហែជំនូន(កំណត់)ចូលរោងជ័យ", time: "ម៉ោង ០៧ : ០០ នាទីព្រឹក" },
  { icon: "/icon/ev3.png", title: "ពិធីពិសារស្លាកំណត់ និង អញ្ជើញភ្ញៀវកិត្តិយសពិសារអាហារពេលព្រឹក", time: "ម៉ោង ០៧ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev4.png", title: "ពិធីបំពាក់ចិញ្ចៀន", time: "ម៉ោង ៨ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev5.png", title: "ពិធីកាត់សក់បង្កក់សិរី", time: "ម៉ោង ៩ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev6.png", title: "ពិធីបង្វិលពពិល សំពះផ្ទឹមចងដៃ និងបាចផ្កាស្លាពរជ័យ", time: "ម៉ោង ១០ : ៣០ នាទីព្រឹក" },
  { icon: "/icon/ev7.png", title: "អញ្ញើញភ្ញៀវកិត្តិយសពិសាអាហារថ្ងៃត្រង់", time: "ម៉ោង ១១ : ៣០ ថ្ងៃត្រង់" },
  { icon: "/icon/ev8.png", title: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយសពិសារ ភោជនាអាហារដោយមេត្រីភាព", time: "ម៉ោង ០៥ : ០០​ ល្ងាច" }
]

// Computed
// eslint-disable-next-line no-unused-vars
const getSpanClass = (index) => {
  if (index < 3) return 'col-span-4'
  if (index === 3) return 'col-span-12'
  if (index > 3 && index < 6) return 'col-span-6'
  return 'col-span-4'
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
    // Add the card's scrollable div as the root if needed,
    // or keep it null to default to the viewport inside the fixed card.
    root: document.querySelector('.overflow-y-auto'),
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

  const targetDate = new Date('2026-02-23T12:00:00')

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
    <!-- Landing Section -->
    <section v-if="!opened" class="landing">
      <div class="min-h-screen w-full flex flex-col justify-start px-4">
        <div class="fixed inset-0 z-0">
          <img src="/image/bg.jpg" class="w-full h-full object-contain" alt="Background" />
          <!-- Floral overlays -->
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top" aria-hidden="true" />
          <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom" aria-hidden="true" />
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
          <div class="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
          <!-- <h1 class="text-2xl md:text-2xl font-moul leading-relaxed lg:text-4xl text-[#7B1F2A] text-center py-2"> -->
          <h1 class="text-lg brown-text mt-10 sm:text-xl whitespace-nowrap font-moul p-3 sm:p-4 rounded-lg">
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h1>
          <p class="text-lg md:text-xl lg:text-2xl mb-8 brown-text text-center max-w-md">
            The Wedding Day
          </p>
          <img src="/icon/badge.png" alt="Ornament" class="w-50 mb-8" />
          <h3 class="text-lg md:text-xl mt-10 font-moul leading-relaxed lg:text-xl mb-4 text-[#ef9ab2] text-center">
            សូមគោរពអញ្ជើញ
          </h3>
          <img src="/icon/bar.png" alt="Heart" class="w-full rotate-180" />
          <p class="text-xl md:text-xl font-moul lg:text-2xl mb-2 mt-2 text-[#c49850] text-center py-1 max-w-md">
            {{ questName }}
          </p>
          <img src="/icon/bar.png" alt="Heart" class="w-full mb-8" />
          <button class="group relative z-10 overflow-hidden px-10 py-4 rounded-full
             backdrop-blur-md bg-white/10 border border-white/40
             text-[#7B1F2A] font-nokora font-semibold text-lg
             shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]
             hover:bg-white/20 hover:scale-105 transition-all duration-500 active:scale-95" @click="openInvitation">
            បើកធៀប
          </button>
        </div>
      </div>
    </section>

    <!-- Story Splash -->
    <!-- <transition name="fade">
      <section v-if="opened && step === 1" class="story-screen">
        <div class="min-h-screen w-full flex flex-col justify-end items-center px-4 relative">
          <img src="/image/p02.jpg" class="absolute inset-0 w-full h-full object-cover" alt="Story background" />

          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

          <div class="absolute bottom-0 left-0 right-0 z-10 pb-20">
            <div class="text-center px-4">
              <transition name="text-fade">
                <div v-if="showSaveDate" class="mb-8">
                  <p
                    class="font-save-date text-white text-4xl font-cinzel font-bold md:text-5xl uppercase tracking-[0.2em] mb-2">
                    Save the date
                  </p>
                  <div class="w-20 h-1 bg-white/60 mx-auto mt-4"></div>
                </div>
              </transition>

              <transition name="text-fade">
                <div v-if="showEventDate" class="animate-fade-in">
                  <p class="text-white/90 text-xl md:text-2xl font-moul mb-3">
                    ថ្ងៃចន្ទ ១៣រោច ខែផល្គុន
                  </p>
                  <p class="text-white text-5xl md:text-6xl font-moul mb-3">
                    ១៦
                  </p>
                  <p class="text-white/90 text-2xl md:text-3xl font-moul mb-2">
                    មីនា ឆ្នាំ ២០២៦
                  </p>
                  <div class="w-32 h-1 bg-white/60 mx-auto mt-6"></div>
                  <p class="text-white/80 text-lg md:text-xl font-nokora mt-4">
                    March 16, 2026
                  </p>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </section>
    </transition> -->

    <!-- Main Invitation -->
    <section v-if="opened && step === 2" class="invitation">
      <div class="relative min-h-screen w-full flex flex-col items-center">
        <!-- Floral overlays -->
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--top" aria-hidden="true" />
        <img src="/icon/flower.png" alt="" class="floral-overlay floral-overlay--bottom" aria-hidden="true" />

        <!-- Background -->
        <div class="fixed inset-0 z-0">
          <img src="/image/bg.jpg" class="w-full h-full object-contain" alt="Background" />
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
          <div class="relative w-full max-w-md h-[90vh]">
            <div class="overflow-y-auto w-full h-full pt-5 custom-scrollbar">
              <!-- <div class="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div> -->
              <h1 data-ref="mainTitle" :class="['brown-text text-lg md:text-xl mt-10 mb-8 font-moul leading-relaxed lg:text-xl text-center py-2 transition-all duration-1000 delay-100',
                visibleElements.mainTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                សិរីមង្គលអាពាហ៍ពិពាហ៍
              </h1>

              <div data-ref="parentsNames" :class="['brown-text grid grid-cols-2 gap-2 font-moul leading-relaxed mb-4 text-center max-w-md transition-all duration-1000 delay-200',
                visibleElements.parentsNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                <div class="grid grid-rows-2 gap-2">
                  <div>
                    <span class="font-metal">លោក </span>
                    <span>ជូ ស្រឿន</span>
                  </div>
                  <div>
                    <span class="font-metal">អ្នកស្រី </span>
                    <span class="">វ៉ា ស៊ីម</span>
                  </div>
                </div>
                <div class="grid grid-rows-2 gap-2">
                  <div>
                    <span class="font-metal">លោក </span>
                    <span>មុំ សម្រស់</span>
                  </div>
                  <div>
                    <span class="font-metal">អ្នកស្រី </span>
                    <span>ជា ផល្លីតា</span>
                  </div>
                </div>
              </div>

              <div data-ref="mainCard" :class="['transition-all duration-1000 delay-300',
                visibleElements.mainCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">

                <h3 data-ref="invitationTitle" :class="['brown-text text-lg md:text-lg font-moul leading-relaxed lg:text-lg mb-4 text-center transition-all duration-1000 delay-400',
                  visibleElements.invitationTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  មានកិត្តិយសសូមគោរពអញ្ជើញ
                </h3>

                <p data-ref="invitationText" :class="['brown-text font-metal leading-loose mb-4 transition-all duration-1000 delay-500',
                  visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា អញ្ជើញចូលរួមជាអធិបតី
                  និងជាភ្ញៀវកិត្តិយសដើម្បីប្រសិទ្ធិពរជ័យ សិរីសួស្តីជ័យមង្គលក្នុងកម្មវិធីរៀបមង្គលអាពាហ៍ពិពាហ៍
                  កូនប្រុស-កូនស្រី របស់យើងខ្ញុំ
                </p>

                <div data-ref="coupleNames" :class="['grid grid-cols-2 gap-2 mb-5 font-moul leading-relaxed mt-10 text-center max-w-md transition-all duration-1000 delay-600',
                  visibleElements.parentsNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <p class="brown-text font-moulpali">កូនប្រុសនាម</p>
                  <p class="brown-text font-moulpali">កូនស្រីនាម</p>
                </div>

                <h2 data-ref="coupleNames" :class="['brown-text font-moul text-base leading-relaxed lg:text-xl mb-10 text-center flex items-center justify-center gap-2 transition-all duration-1000 delay-700',
                  visibleElements.coupleNames ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  ឌីន គីមស្រ៊ី
                  <img src="/icon/brown-jeaku.png" alt="Logo" class="w-18" />
                  អ៊ុច សុខហេង
                </h2>

                <div data-ref="dateInfo" :class="['transition-all duration-1000 delay-800',
                  visibleElements.dateInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <p class="brown-text text-xl md:text-2xl font-moul mb-3">
                    ថ្ងៃចន្ទ ៧កើត ខែផល្គុន
                  </p>
                  <div class="w-32 h-1 bg-[#c49850]/60 mx-auto mt-5 mb-5"></div>
                  <p class="brown-text text-5xl md:text-6xl font-moul">
                    ២៣
                  </p>
                  <div class="w-32 h-1 bg-[#c49850]/60 mx-auto mt-5 mb-5"></div>
                  <p class="brown-text text-2xl md:text-3xl font-moul mb-10">
                    កុម្ភៈ ២០២៦
                  </p>


                </div>

                <div class="relative w-full max-w-md p-6
                 bg-[#c49850]
                 rounded-3xl md:rounded-[2.5rem]
                 border-4 border-white shadow-2xl
                 flex flex-col overflow-hidden">
                  <p data-ref="dateInfo" :class="['dust-white-text font-metal leading-loose mb-4 transition-all duration-1000 delay-900',
                    visibleElements.dateInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    ដែលនឹងប្រព្រឹត្តទៅនៅថ្ងៃចន្ទ ៧កើត ខែផល្គុន ឆ្នាំម្សាញ់ សប្តស័ក ពុទ្ធសករាជ ២៥៦៩ ត្រូវនឹងថ្ងៃទី ២៣
                    ខែកុម្ភៈ
                    ឆ្នាំ ២០២៦
                  </p>

                  <p data-ref="locationInfo" :class="['text-base tracking-wider dust-white-text font-moul leading-loose mb-4 transition-all duration-1000 delay-1000',
                    visibleElements.locationInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    <span class="font-metal">វេលាម៉ោង ៥ : ០០ ល្ងាច នៅ </span>
                    <span class="">ផ្សារទំនើបអុីអន២ សែនសុខ (ជាន់ទី៣) </span>
                    <!-- <span class="font-nokora font-extrabold gold-text">A </span> -->
                    <span class="font-metal">។ ដោយមេត្រីភាព!</span>
                  </p>
                  <div
                    class="w-full overflow-hidden rounded-2xl border border-white/40 shadow-lg transition-all duration-1000 delay-1100"
                    :class="visibleElements.locationInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3906.697880214546!2d104.88279527584474!3d11.599669143468102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109522e1adbf683%3A0x3f4395cd35ec9617!2sAEON%20Mall%20Sen%20Sok%20City!5e0!3m2!1sen!2skh!4v1770492834601!5m2!1sen!2skh"
                      class="w-full h-60 md:h-72" style="border:0;" allowfullscreen="" loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"></iframe>
                  </div>
                  <h2 data-ref="timelineHeader" :class="['text-base leading-loose dust-white-text text-center font-moul p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1200',
                    timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    រាប់ថយក្រោយដល់ពិធីមង្គលអាពាហ៍ពិពាហ៍
                  </h2>

                  <div class="w-full flex justify-center">
                    <div class="grid grid-cols-4 gap-2 sm:gap-3">
                      <div class="min-w-20 sm:min-w-20 text-center ">
                        <div class="text-2xl sm:text-2xl font-moul dust-white-text">{{ countdown.days }}</div>
                        <div class="text-[12px] sm:text-xs font-nokora dust-white-text tracking-wide">ថ្ងៃ</div>
                      </div>
                      <div class="min-w-20 sm:min-w-20 text-center ">
                        <div class="text-2xl sm:text-2xl font-moul dust-white-text">{{ countdown.hours }}</div>
                        <div class="text-[12px] sm:text-xs font-nokora dust-white-text tracking-wide">ម៉ោង</div>
                      </div>
                      <div class="min-w-20 sm:min-w-20 text-center ">
                        <div class="text-2xl sm:text-2xl font-moul dust-white-text">{{ countdown.minutes }}</div>
                        <div class="text-[12px] sm:text-xs font-nokora dust-white-text tracking-wide">នាទី</div>
                      </div>
                      <div class="min-w-20 sm:min-w-20 text-center ">
                        <div class="text-2xl sm:text-2xl font-moul dust-white-text">{{ countdown.seconds }}</div>
                        <div class="text-[12px] sm:text-xs font-nokora dust-white-text tracking-wide">វិនាទី</div>
                      </div>
                    </div>
                  </div>

                </div>


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
                    timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    កម្មវិធីមង្គលអាពាហ៍ពិពាហ៍
                  </h2>
                  <h2 data-ref="timelineHeader" :class="['brown-text text-base leading-loose text-center font-moul p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1500',
                    timelineHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    កម្មវិធី ថ្ងៃចន្ទ ទី២៣ ខែកុម្ភៈ ឆ្នាំ២០២៦
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
                          <p class="text-text-light font-nokora brown-text text-lg font-semibold leading-normal">
                            {{ event.title }}
                          </p>
                          <p class="text-base text-[#ef9ab2] font-moul leading-normal">{{ event.time }}</p>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- Gallery Section -->
                <div data-ref="gallerySection" :class="['relative transition-all duration-1000 delay-1600',
                  visibleElements.gallerySection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                  <!-- <h2 data-ref="galleryTitle" :class="['text-lg sm:text-xl text-center whitespace-nowrap font-moul gold-text bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1700',
                    galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    វិចិត្រសាល
                  </h2> -->

                  <!-- <div class="grid grid-cols-12 gap-4">
                  <div v-for="(img, index) in images" :key="img.id" :ref="el => setGalleryRef(el, index)" :class="['relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-700',
                    getSpanClass(index),
                    visibleGalleryItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                    @click="selectedImg = img.url">
                    <img :src="img.url" :alt="img.alt"
                      class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div
                      class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span class="text-white font-medium">View Full</span>
                    </div>
                  </div>
                </div> -->

                  <!-- <div class="grid grid-cols-1 gap-4">
                    <div v-for="(img, index) in images" :key="img.id" :ref="el => setGalleryRef(el, index)" :class="['relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-700',
                      visibleGalleryItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']"
                      @click="selectedImg = img.url">
                      <img :src="img.url" :alt="img.alt"
                        class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                      <div
                        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span class="text-white font-medium">View Full</span>
                      </div>
                    </div>
                  </div> -->
                  <h2 data-ref="galleryTitle" :class="['brown-text text-lg sm:text-xl text-center whitespace-nowrap font-moul bg-white/10 p-3 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                    galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    ទទួលចំណងដៃ
                  </h2>
                  <img src="/icon/qr-aba.png" alt="QR Code"
                    class="mx-auto my-6 w-48 h-48 object-cover rounded-3xl shadow-lg border border-white/30" />

                  <h2 data-ref="galleryTitle" :class="['brown-text text-lg mt-2 mb-8 sm:text-xl text-center whitespace-nowrap font-sans font-bold bg-white/10 p-1 sm:p-4 rounded-lg transition-all duration-1000 delay-1800',
                    galleryTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    SOKHENG AND KIMSRY
                  </h2>

                  <!-- RSVP Section -->
                  <div class="mt-8 p-5 bg-white/10 rounded-2xl border border-white/20 text-left">
                    <h3 class="brown-text text-lg font-sans font-extrabold text-center mb-3">RSVP</h3>
                    <p class="brown-text font-metal leading-loose text-sm text-center mb-4">
                      សូមបញ្ជាក់វត្តមានរបស់អ្នក ដើម្បីឲ្យយើងខ្ញុំអាចរៀបចំការត្រៀមខ្លួនបានល្អប្រសើរឡើង
                    </p>
                    <div class="flex items-center justify-center gap-4 mb-4">
                      <label :class="[
                        'flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-metal text-sm',
                        rsvpStatus === 'yes'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-500 hover:border-emerald-100'
                      ]">
                        <input type="radio" name="rsvp" value="yes" v-model="rsvpStatus" class="hidden" />
                        <span>អាចចូលរួម</span>
                      </label>

                      <label :class="[
                        'flex-1 flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 font-metal text-sm',
                        rsvpStatus === 'no'
                          ? 'border-red-400 bg-red-50 text-red-800 shadow-sm'
                          : 'border-gray-100 bg-white text-gray-500 hover:border-red-100'
                      ]">
                        <input type="radio" name="rsvp" value="no" v-model="rsvpStatus" class="hidden" />
                        <span>មិនបានចូលរួម</span>
                      </label>
                    </div>
                    <textarea v-model="rsvpMessage" rows="3" placeholder="ផ្ញើរសារ (optional)"
                      class="w-full rounded-lg p-3 text-sm font-metal bg-white/80 text-[#6b4a2f] placeholder-[#6b4a2f]/70 outline-none"></textarea>
                    <a :href="telegramRsvpUrl" target="_blank" rel="noreferrer"
                      class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 bg-[#2AABEE] text-white font-nokora font-semibold transition hover:scale-105 active:scale-95">
                      ផ្ញើរតាមតេលេក្រាម<span><svg viewBox="0 0 24 24" aria-hidden="true"
                          class="theab-footer__icon">
                          <path fill="#fff"
                            d="M20.4 5.2 3.7 11.7c-1 .4-.9 1.8.1 2.1l3.7 1.2 1.4 4.3c.2.7 1.1.9 1.6.3l2.2-2.5 4.1 3c.5.4 1.3.1 1.5-.6l2.8-12.3c.2-.9-.6-1.6-1.7-1Z" />
                        </svg></span>
                    </a>
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
                  <h3 data-ref="invitationTitle" :class="['brown-text text-lg md:text-lg font-moul leading-relaxed lg:text-lg mb-4 text-center transition-all duration-1000 delay-400',
                    visibleElements.invitationTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    សេចក្តីថ្លែងអំណរគុណ និងសូមអភ័យទោស
                  </h3>

                  <p data-ref="invitationText" :class="['brown-text font-metal leading-loose mb-4 transition-all duration-1000 delay-500',
                    visibleElements.invitationText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
                    យើងខ្ញុំសូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះការអញ្ជើញចូលរួមជា ភ្ញៀវកិត្តិយស ក្នុងពិធីរបស់យើងខ្ញុំ
                    និងសូមខន្តីអភ័យទោសដោយពុំបានអញ្ជើញ
                    ដោយផ្ទាល់ និងការសរសេរឈ្មោះរបស់ភ្ញៀវកិត្តិយសមិនបានត្រឹមត្រូវ ឫពុំបានសេសេរឈ្មោះ ។
                    សូមជូនពរ ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និងភ្ញៀវកិត្តិយសទាំងអស់
                    សិរីសួស្តីជ័យមង្គល
                    និងទទួលបានជោគជ័យគ្រប់ភារកិច្ច ។
                    សូមអរគុណ និងសូមអភ័យទោសម្ដងទៀត!
                  </p>
                </div>

                <!-- Footer -->
                <footer class="theab-footer mt-10 mb-25">
                  <div class="theab-footer__brand">
                    <div class="theab-footer__logo">
                      <img src="/icon/theab-icon.jpg" alt="TheabStudio logo" class="theab-footer__logo-img" />
                    </div>
                    <div class="theab-footer__text">
                      <span class="theab-footer__title">Made by</span>
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
  color: #c49850;
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
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
  left: 0;
  width: 100%;
  height: 22vh;
  object-fit: cover;
  z-index: 20;
  pointer-events: none;
}

.floral-overlay--top {
  top: -70px;
  transform: rotate(180deg);
}

.floral-overlay--bottom {
  bottom: -70px;

}

/* Ensure the invitation section doesn't scroll the whole page */
.invitation {
  overflow: hidden;
  height: 100vh;
}

@media (max-width: 640px) {
  .theab-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>
