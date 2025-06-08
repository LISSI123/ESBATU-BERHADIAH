
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

mulaiBtn.addEventListener("click", async () => {
  const userId = userIdInput.value.trim();
  const kupon = kuponInput.value.trim();

  if (!userId || !kupon) return alert("Isi USER ID dan KODE KUPON!");

  const docRef = doc(db, "kupon", kupon);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return alert("Kupon tidak ditemukan!");

  const data = docSnap.data();
  if (data.dipakai) return alert("Kupon sudah digunakan!");

  await updateDoc(docRef, {
    dipakai: true,
    userId: userId,
    waktu: new Date().toISOString(),
  });

  document.querySelector(".form-box").classList.add("hidden");
  gameBox.classList.remove("hidden");
});

const esBatu = document.querySelectorAll(".ice");

esBatu.forEach((el) => {
  el.addEventListener("click", () => {
    if (el.classList.contains("broken")) return;
    el.classList.add("clicked");

    setTimeout(() => {
      el.classList.remove("clicked");
      el.classList.add("broken");

      const hadiah = hadiahList[Math.floor(Math.random() * hadiahList.length)];
      el.querySelector(".hadiah").textContent = `+${hadiah.toLocaleString()}`;
    }, 500);
  });
});
