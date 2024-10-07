function generateDateSeq(date = null) {
  if (date === null) {
    date = new Date();
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
  const year = String(date.getFullYear()).slice(2);
  const weekday = String(date.getDay());

  return day[0] + month[0] + year[0] + weekday + day[1] + month[1] + year[1];
}

function getRandomCharSeq(n) {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < n; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }

  return result;
}

function base64Encode(data) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
}

function base64Decode(data) {
  return Uint8Array.from(atob(data), c => c.charCodeAt(0));
}

// Initialization Vector (IV)
const IV = new TextEncoder().encode("dcek9wb8frty1pnm");

// Helper function to generate the AES key
async function generateKey(date = null) {
  const dateSeq = generateDateSeq(date);
  const keyData = new TextEncoder().encode('qa8y' + dateSeq + 'ty1pn');
  return window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

// Helper function to generate the LocalName for the request header
async function generateLocalName(date = null) {

  const randomCharSeq = getRandomCharSeq(4);
  const dateSeq = generateDateSeq(date);
  const randomSuffix = getRandomCharSeq(5);
  const nameBytes = new TextEncoder().encode(randomCharSeq + dateSeq + randomSuffix);
  const encryptedBytes = await encrypt(nameBytes);

  return base64Encode(encryptedBytes);
}

// Function to encrypt data using AES-CBC
async function encrypt(data) {
  const key = await generateKey();
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: IV },
    key,
    data
  );
  return new Uint8Array(encrypted);
}

// Function to decrypt data using AES-CBC
async function decrypt(data) {
  const key = await generateKey();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: IV },
    key,
    data
  );
  return new Uint8Array(decrypted);
}


// Function to deserialize the payload (decrypts base64 payload)
async function deserializePayload(payload) {
  const pbytes = base64Decode(payload);
  const raw = await decrypt(pbytes);
  return JSON.parse(new TextDecoder().decode(raw));
}

// Function to serialize the payload (encrypts and returns base64 string)
async function serializePayload(payload) {
  const raw = new TextEncoder().encode(JSON.stringify(payload));
  const pbytes = await encrypt(raw);
  return base64Encode(pbytes);
}

