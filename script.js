import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJCpFDQZ8hzmyWBP9tqBT1JKYhQNHvwZA",
  authDomain: "laso-8ae5d.firebaseapp.com",
  projectId: "laso-8ae5d",
  storageBucket: "laso-8ae5d.appspot.com",
  messagingSenderId: "671991076380",
  appId: "1:671991076380:web:fe160c4225a1f1b8eff1d9",
  measurementId: "G-ED1ZRQTBN9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const hadiahList = [1000, 2000, 3000, 5000, 7000, 10000, 15000];

const userIdInput = document.getElementById("userId");
const kuponInput = document.getElementById("kupon");
const mulaiBtn = document.getElementById("mulaiBtn");
const gameBox = document.getElementById("gameBox");

// Tambahkan efek suara dan confetti
const confettiUrl =
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
let confettiLoaded = false;
function loadConfetti() {
  if (confettiLoaded) return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = confettiUrl;
    script.onload = () => {
      confettiLoaded = true;
      resolve();
    };
    document.body.appendChild(script);
  });
}

// Suara efek
const audioSuccess = new Audio(
  "https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4b3b.mp3"
);
const audioClick = new Audio(
  "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b273a.mp3"
);

function showToast(msg, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

mulaiBtn.addEventListener("click", async () => {
  const userId = userIdInput.value.trim();
  const kupon = kuponInput.value.trim();

  if (!userId || !kupon) {
    showToast("Isi USER ID dan KODE KUPON!", "error");
    return;
  }

  const docRef = doc(db, "kupon", kupon);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    showToast("Kupon tidak ditemukan!", "error");
    return;
  }

  const data = docSnap.data();
  if (data.dipakai) {
    showToast("Kupon sudah digunakan!", "warning");
    return;
  }

  await updateDoc(docRef, {
    dipakai: true,
    userId: userId,
    waktu: new Date().toISOString(),
  });

  document.querySelector(".form-box").classList.add("hidden");
  gameBox.classList.remove("hidden");
  showToast("Selamat datang! Silakan pilih es batu.", "success");
});

// Ganti gambar es batu dan es retak dengan gambar baru yang lebih jelas
const ICE_IMG = 'https://cdn.pixabay.com/photo/2016/03/23/19/58/ice-1273382_1280.png';
const ICE_CRACKED_IMG = 'https://cdn.pixabay.com/photo/2017/01/06/19/15/ice-1959326_1280.png';

// --- HANYA BOLEH PILIH SATU ES BATU ---
let sudahPilih = false;
const MAX_HIT = 3;
const esBatu = document.querySelectorAll('.ice');
const hitCounter = Array.from({ length: esBatu.length }, () => 0);

esBatu.forEach((el, idx) => {
  el.addEventListener('click', async () => {
    if (sudahPilih && !el.classList.contains('broken')) return; // hanya satu yang bisa dipukul
    if (el.classList.contains('broken')) return;
    hitCounter[idx]++;
    el.classList.add('clicked');
    setTimeout(() => el.classList.remove('clicked'), 200);
    if (hitCounter[idx] === 2) {
      el.style.background = `url('${ICE_CRACKED_IMG}') no-repeat center center`;
      el.style.backgroundSize = 'cover';
    }
    if (hitCounter[idx] >= MAX_HIT) {
      el.classList.add('broken');
      el.style.background = 'none';
      el.querySelector('.hadiah').textContent = '';
      sudahPilih = true;
      // Disable semua es lain
      esBatu.forEach((e, i) => { if(i!==idx) e.classList.add('disabled-ice'); });
      // Random hadiah
      const hadiah = hadiahList[Math.floor(Math.random() * hadiahList.length)];
      el.querySelector('.hadiah').textContent = `+${hadiah.toLocaleString()}`;
      el.querySelector('.hadiah').classList.add('pop-hadiah');
      audioSuccess.currentTime = 0;
      audioSuccess.play();
      showToast(`Selamat! Kamu dapat hadiah Rp${hadiah.toLocaleString()}`,'success');
      showClaimTelegram();
      showToast('Segera claim hadiah kamu ke Telegram: @freebetjokerscm', 'info');
      await loadConfetti();
      window.confetti && window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  });
});

function showClaimTelegram() {
  if (document.getElementById('claim-telegram')) return;
  const claim = document.createElement('div');
  claim.id = 'claim-telegram';
  claim.innerHTML = `
    <div class="claim-box">
      <b>Claim hadiah kamu di Telegram:</b><br>
      <a href="https://t.me/freebetjokerscm" target="_blank" class="btn-claim-tg">CLAIM SEKARANG</a>
    </div>
  `;
  document.body.appendChild(claim);
  setTimeout(() => claim.classList.add('show'), 100);
}

// Toast CSS inject (agar toast tampil mewah)
(function injectToastStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
    .toast {
      position: fixed;
      left: 50%;
      top: 30px;
      transform: translateX(-50%) scale(0.9);
      background: rgba(30,30,40,0.95);
      color: #fff;
      padding: 16px 32px;
      border-radius: 32px;
      font-size: 1.1rem;
      font-weight: 600;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      opacity: 0;
      z-index: 9999;
      transition: all 0.4s cubic-bezier(.4,2,.3,1);
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) scale(1); }
    .toast-success { background: linear-gradient(90deg,#00c6fb,#005bea); }
    .toast-error { background: linear-gradient(90deg,#ff5858,#f09819); }
    .toast-warning { background: linear-gradient(90deg,#f7971e,#ffd200); color:#222; }
    .toast-info { background: linear-gradient(90deg,#43cea2,#185a9d); }
    .pop-hadiah {
      animation: popHadiah 0.7s cubic-bezier(.4,2,.3,1);
    }
    @keyframes popHadiah {
      0% { transform: scale(0.2); opacity: 0; }
      60% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
})();
