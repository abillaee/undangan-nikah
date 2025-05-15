// Buka undangan
function openInvitation() {
  // Fade out landing page
  document.getElementById("landingPage").style.opacity = "0";
  document.getElementById("landingPage").style.transform = "translateY(-20px)";
  
  setTimeout(function() {
    document.getElementById("landingPage").classList.add("hidden");
    
    // Prepare mainPage for animation
    const mainPage = document.getElementById("mainPage");
    mainPage.classList.remove("hidden");
    mainPage.style.opacity = "0";
    mainPage.style.transform = "translateY(20px)";
    
    // Trigger reflow
    void mainPage.offsetWidth;
    
    // Fade in mainPage
    mainPage.style.opacity = "1";
    mainPage.style.transform = "translateY(0)";
    
    // Tambahkan class untuk animasi bunga pada halaman utama
    setTimeout(function() {
      document.querySelectorAll('.page-decoration').forEach(function(flower) {
        flower.classList.add('animated');
      });
      
      // Tambahkan animasi untuk card dengan background bunga
      document.querySelectorAll('.card-with-flower-bg').forEach(function(card, index) {
        setTimeout(function() {
          card.classList.add('animated');
        }, 200 * index); // Animasi berurutan untuk setiap card
      });
      
      // Refresh AOS untuk memastikan animasi berjalan
      AOS.refresh();
    }, 300);
    
    // Putar musik latar jika ada
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
      // Gunakan Promise untuk menangani autoplay prevention
      const playPromise = backgroundMusic.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(function(error) {
          // Autoplay was prevented, show music button
          const musicButton = document.getElementById("musicButton");
          if (musicButton) {
            musicButton.style.animation = "pulse 1.5s infinite";
          }
        });
      }
    }
  }, 500);
}

// Countdown
const weddingDate = new Date("Juni 19, 2025 08:00:00").getTime();
const countdownElement = document.getElementById("countdown");

const countdownTimer = setInterval(function () {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (countdownElement) {
    countdownElement.innerHTML =
      days +
      " Hari " +
      hours +
      " Jam " +
      minutes +
      " Menit " +
      seconds +
      " Detik";

    if (distance < 0) {
      clearInterval(countdownTimer);
      countdownElement.innerHTML = "Hari Bahagia Telah Tiba!";
    }
  }
}, 1000);

// Fungsi untuk mendapatkan nama tamu dari URL parameter
function getGuestNameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  const guestNameElement = document.getElementById('guestName');
  
  if (guestName && guestNameElement) {
    guestNameElement.textContent = decodeURIComponent(guestName);
  }
}

// Panggil fungsi untuk mendapatkan nama tamu
document.addEventListener('DOMContentLoaded', function() {
  getGuestNameFromURL();
});

// Inisialisasi AOS (Animate On Scroll) dengan pengaturan yang lebih ringan untuk mobile
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
    delay: 100,
    throttleDelay: 99,
    disable: 'phone' // Disable AOS on mobile for better performance
  });
  
  // Gunakan animasi manual yang lebih ringan untuk mobile
  const cards = document.querySelectorAll('.card');
  
  // Fungsi untuk mengecek apakah elemen terlihat di viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Fungsi untuk menambahkan animasi saat elemen terlihat
  function animateOnScroll() {
    cards.forEach(function(card) {
      if (isElementInViewport(card) && !card.classList.contains('animated')) {
        card.classList.add('animated');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Set initial state
  cards.forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Tambahkan event listener untuk scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Panggil sekali untuk elemen yang sudah terlihat saat halaman dimuat
  animateOnScroll();
});

// Fungsi untuk toggle musik latar
function toggleMusic() {
  const backgroundMusic = document.getElementById("backgroundMusic");
  const musicButton = document.getElementById("musicButton");
  
  if (backgroundMusic && musicButton) {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      musicButton.innerHTML = '<i class="fas fa-volume-up"></i>';
      musicButton.style.animation = "none";
    } else {
      backgroundMusic.pause();
      musicButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }
}

// Fungsi untuk copy rekening ke clipboard
function copyToClipboard(text) {
  // Untuk perangkat modern
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showCopyNotification())
      .catch(err => {
        // Fallback untuk perangkat yang tidak mendukung Clipboard API
        fallbackCopyToClipboard(text);
      });
  } else {
    // Fallback untuk perangkat yang tidak mendukung Clipboard API
    fallbackCopyToClipboard(text);
  }
}

// Fallback copy to clipboard untuk perangkat lama
function fallbackCopyToClipboard(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // Untuk mobile
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  
  showCopyNotification();
}

// Tampilkan notifikasi copy
function showCopyNotification() {
  // Hapus notifikasi yang sudah ada jika ada
  const existingNotification = document.querySelector('.copy-notification');
  if (existingNotification) {
    document.body.removeChild(existingNotification);
  }
  
  // Buat notifikasi baru
  const notification = document.createElement("div");
  notification.className = "copy-notification";
  notification.textContent = "Nomor rekening berhasil disalin!";
  document.body.appendChild(notification);
  
  // Hapus notifikasi setelah beberapa detik
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 2000);
}

// Fungsi untuk menambahkan ucapan dan doa
function addWish(event) {
  event.preventDefault();
  
  const name = document.getElementById("wishName").value;
  const message = document.getElementById("wishMessage").value;
  
  if (!name || !message) {
    alert("Mohon isi nama dan ucapan Anda");
    return;
  }
  
  // Buat elemen ucapan baru
  const wishesContainer = document.getElementById("wishesContainer");
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const wishItem = document.createElement("div");
  wishItem.className = "wish-item";
  wishItem.innerHTML = `
    <div class="wish-header">
      <div class="wish-name">${name}</div>
      <div class="wish-date">${dateString}</div>
    </div>
    <div class="wish-message">${message}</div>
  `;
  
  // Tambahkan ke container
  wishesContainer.prepend(wishItem);
  
  // Reset form
  document.getElementById("wishForm").reset();
  
  // Simpan ke localStorage untuk persistensi data
  saveWishesToLocalStorage();
}

// Fungsi untuk menyimpan ucapan ke localStorage
function saveWishesToLocalStorage() {
  const wishesContainer = document.getElementById("wishesContainer");
  if (wishesContainer) {
    localStorage.setItem('wedding-wishes', wishesContainer.innerHTML);
  }
}

// Fungsi untuk memuat ucapan dari localStorage
function loadWishesFromLocalStorage() {
  const wishesContainer = document.getElementById("wishesContainer");
  if (wishesContainer) {
    const savedWishes = localStorage.getItem('wedding-wishes');
    if (savedWishes) {
      wishesContainer.innerHTML = savedWishes;
    }
  }
}

// Fungsi untuk menyesuaikan ukuran bunga berdasarkan ukuran layar
function adjustFlowerSize() {
  const isSmallMobile = window.innerWidth <= 320;
  
  const flowerDecorations = document.querySelectorAll('.flower-decoration');
  const pageDecorations = document.querySelectorAll('.page-decoration');
  
  if (isSmallMobile) {
    flowerDecorations.forEach(flower => {
      flower.style.width = '80px';
    });
    pageDecorations.forEach(flower => {
      flower.style.width = '70px';
    });
  } else {
    flowerDecorations.forEach(flower => {
      flower.style.width = '100px';
    });
    pageDecorations.forEach(flower => {
      flower.style.width = '90px';
    });
  }
}

// Fungsi untuk menampilkan loading indicator
function showLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
  }
}

// Fungsi untuk menyembunyikan loading indicator
function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
}

// Event listeners saat halaman dimuat
window.addEventListener('load', function() {
  hideLoading();
  adjustFlowerSize();
  loadWishesFromLocalStorage();
  
  // Tambahkan class untuk animasi bunga pada landing page
  document.querySelectorAll('.flower-decoration').forEach(function(flower) {
    flower.classList.add('animated');
  });
});

// Event listener saat ukuran layar berubah
window.addEventListener('resize', adjustFlowerSize);

// Tambahkan efek parallax ringan pada background
window.addEventListener('scroll', function() {
  // Batasi efek parallax hanya untuk perangkat dengan performa baik
  if (window.innerWidth >= 768) {
    const scrollPosition = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');
    if (parallaxBg) {
      parallaxBg.style.transform = 'translateY(' + scrollPosition * 0.3 + 'px)';
    }
  }
});

// Preload gambar penting
function preloadImages() {
  const imageUrls = [
    'img/atas.png',
    'img/bawah.png',
    'img/bg-flower.png'
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Panggil fungsi preload gambar
preloadImages();

// Tambahkan animasi pulse untuk tombol musik
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  </style>
`);
