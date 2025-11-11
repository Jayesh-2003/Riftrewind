// app.js - Frontend logic for League Roaster Bot
const API_BASE_URL = '/api';

// ==================== STORAGE MANAGEMENT ====================
class UserStorage {
  static getUser() {
    const user = localStorage.getItem('leagueRoasterUser');
    return user ? JSON.parse(user) : null;
  }

  static saveUser(userData) {
    localStorage.setItem('leagueRoasterUser', JSON.stringify(userData));
  }

  static clearUser() {
    localStorage.removeItem('leagueRoasterUser');
  }

  static isRegistered() {
    return this.getUser() !== null;
  }

  static getUserId() {
    const user = this.getUser();
    return user ? user.userId : null;
  }

  static getPUUID() {
    const user = this.getUser();
    return user ? user.puuid : null;
  }

  static getGameName() {
    const user = this.getUser();
    return user ? `${user.gameName}#${user.tagLine}` : null;
  }
}

// ==================== AUTH MODAL ====================
function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const gameName = document.getElementById('auth-game-name').value;
  const tagLine = document.getElementById('auth-tag-line').value;

  if (!gameName || !tagLine) {
    showStatus('❌ Please enter both Game Name and Tag Line', 'error');
    return;
  }

  const authBtn = event.target.querySelector('button');
  const btnText = authBtn.querySelector('.btn-text');
  const btnLoader = authBtn.querySelector('.btn-loader');

  try {
    authBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    // Generate a unique userId based on timestamp
    const userId = `user_${Date.now()}`;

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, gameName, tagLine })
    });

    const data = await response.json();

    if (!response.ok) {
      showStatus(`❌ ${data.error}`, 'error');
      return;
    }

    console.log('✅ Registration Response:', data);

    // Save user to localStorage
    UserStorage.saveUser({
      userId,
      gameName: data.data.gameName,
      tagLine: data.data.tagLine,
      puuid: data.data.puuid
    });

    console.log('💾 User saved to localStorage:', UserStorage.getUser());

    showStatus(`✅ Welcome ${gameName}! Account saved locally.`, 'success');
    
    // Clear form
    event.target.reset();

    // Close modal after 1 second
    setTimeout(() => {
      hideAuthModal();
      updateUIForAuthenticatedUser();
    }, 1000);

  } catch (error) {
    console.error('Error:', error);
    showStatus(`❌ ${error.message}`, 'error');
  } finally {
    authBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

function logout() {
  UserStorage.clearUser();
  hideAuthModal();
  showStatus('✅ Logged out successfully', 'success');
  updateUIForAuthenticatedUser();
}

function updateUIForAuthenticatedUser() {
  const authSection = document.getElementById('auth-section');
  const userInfo = document.getElementById('user-info');

  if (UserStorage.isRegistered()) {
    const user = UserStorage.getUser();
    userInfo.innerHTML = `
      <span>👤 ${user.gameName}#${user.tagLine}</span>
      <button class="logout-btn" onclick="logout()">Logout</button>
    `;
    authSection.style.display = 'flex';
  } else {
    authSection.style.display = 'none';
  }
}

// ==================== TAB SWITCHING ====================
function switchTab(tabName) {
  if (!UserStorage.isRegistered()) {
    showStatus('⚠️ Please register first', 'error');
    showAuthModal();
    return;
  }

  // Hide all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Deactivate all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Activate corresponding nav button
  event.target.classList.add('active');
}

// Show status message
function showStatus(message, type = 'success') {
    const container = document.getElementById('status-container');
    const messageEl = document.createElement('div');
    messageEl.className = `status-message status-${type}`;
    messageEl.textContent = message;
    container.innerHTML = '';
    container.appendChild(messageEl);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ==================== REGISTER HANDLER ====================
async function handleRegister(event) {
    event.preventDefault();

    const userId = document.getElementById('reg-user-id').value;
    const gameName = document.getElementById('reg-game-name').value;
    const tagLine = document.getElementById('reg-tag-line').value;

    const button = event.target.querySelector('button');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    try {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, gameName, tagLine })
        });

        const data = await response.json();

        if (!response.ok) {
            showStatus(`❌ ${data.error}`, 'error');
            return;
        }

        showStatus('✅ Account registered successfully!', 'success');

        // Display roast
        const resultDiv = document.getElementById('register-result');
        document.getElementById('register-roast').textContent = data.data.nameRoast;
        resultDiv.style.display = 'block';

        // Clear form
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ==================== ROAST HANDLER ====================
async function handleRoast(event) {
    event.preventDefault();

    const userId = UserStorage.getUserId();
    if (!userId) {
      showStatus('⚠️ Please register first', 'error');
      showAuthModal();
      return;
    }

    const button = event.target.querySelector('button');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    try {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        const response = await fetch(`${API_BASE_URL}/roast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        const data = await response.json();

        if (!response.ok) {
            showStatus(`❌ ${data.error}`, 'error');
            return;
        }

        console.log('🔥 Roast Data Received:', data);
        
        showStatus('✅ Roast generated!', 'success');

        // Display stats
        const stats = data.data.playerStats;
        console.log('Player Stats:', stats);
        
        // Safe element update function
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = value;
                console.log(`✅ Updated ${id}`);
            } else {
                console.error(`❌ Element ${id} not found!`);
            }
        };
        
        updateElement('roast-champion', stats.champion);
        updateElement('roast-role', stats.role);
        updateElement('roast-kda', `${stats.kills}/${stats.deaths}/${stats.assists}`);
        updateElement('roast-kda-ratio', stats.kda);
        updateElement('roast-cs', stats.cs);
        updateElement('roast-gpm', `${stats.goldPerMin}/min`);
        updateElement('roast-damage', formatNumber(stats.damage));
        updateElement('roast-win-loss', stats.win ? '✅ WIN' : '❌ LOSS');
        console.log('✅ Stats displayed, showing result container...');

        // Display roast
        document.getElementById('roast-overview').textContent = data.data.roast;

        // Display timeline roast if available
        if (data.data.timelineRoast) {
            const timelineBox = document.getElementById('timeline-roast-box');
            document.getElementById('roast-timeline').textContent = data.data.timelineRoast;
            timelineBox.style.display = 'block';
        }

        // Show the result container
        const resultContainer = document.getElementById('roast-result');
        if (resultContainer) {
            resultContainer.style.display = 'block';
            console.log('✅ Result container shown');
        } else {
            console.error('❌ roast-result container not found!');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ==================== ANALYSIS HANDLER ====================
async function handleAnalysis(event) {
    event.preventDefault();

    const userId = UserStorage.getUserId();
    if (!userId) {
      showStatus('⚠️ Please register first', 'error');
      showAuthModal();
      return;
    }

    const matchCount = parseInt(document.getElementById('analysis-count').value) || 10;
    const button = event.target.querySelector('button');
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    try {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        const response = await fetch(`${API_BASE_URL}/analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, matchCount })
        });

        const data = await response.json();

        if (!response.ok) {
            showStatus(`❌ ${data.error}`, 'error');
            return;
        }

        console.log('📊 Analysis Data Received:', data);
        
        showStatus('✅ Analysis complete!', 'success');

        // Display player info
        const playerInfo = document.getElementById('analysis-player-info');
        console.log('Player Info Element:', playerInfo);
        playerInfo.innerHTML = `
            <h3>${data.data.player.gameName}#${data.data.player.tagLine}</h3>
            <p>Analyzed ${data.data.matches.length} matches</p>
        `;

        // Display stats
        const stats = data.data.overallStats;
        console.log('Overall Stats:', stats);
        console.log('Stats types:', {
            avgKills: typeof stats.avgKills,
            avgDeaths: typeof stats.avgDeaths,
            avgAssists: typeof stats.avgAssists,
            avgKDA: typeof stats.avgKDA
        });
        document.getElementById('analysis-wr').textContent = stats.winRate;
        document.getElementById('analysis-kda').textContent = `${stats.avgKills}/${stats.avgDeaths}/${stats.avgAssists}`;
        document.getElementById('analysis-kda-ratio').textContent = stats.avgKDA;
        document.getElementById('analysis-cs').textContent = stats.avgCS;
        document.getElementById('analysis-gpm').textContent = `${stats.avgGold}/min`;
        document.getElementById('analysis-damage').textContent = formatNumber(parseInt(stats.avgDamage));
        console.log('✅ Stats displayed successfully');

        // Display champion pool
        const champs = data.data.championPool;
        console.log('Champion Pool:', champs);
        
        if (champs.best) {
            const bestCard = document.getElementById('analysis-best-champ');
            const bestAvgKDA = champs.best.avgKDA ? (typeof champs.best.avgKDA === 'string' ? champs.best.avgKDA : champs.best.avgKDA.toFixed(2)) : 'N/A';
            bestCard.innerHTML = `
                <h4>🟢 Best Champion</h4>
                <p><strong>${champs.best.name}</strong></p>
                <p>Win Rate: ${champs.best.winRate}%</p>
                <p>Games: ${champs.best.games}</p>
                <p>Avg KDA: ${bestAvgKDA}</p>
            `;
        }

        if (champs.worst) {
            const worstCard = document.getElementById('analysis-worst-champ');
            const worstAvgKDA = champs.worst.avgKDA ? (typeof champs.worst.avgKDA === 'string' ? champs.worst.avgKDA : champs.worst.avgKDA.toFixed(2)) : 'N/A';
            worstCard.innerHTML = `
                <h4>🔴 Worst Champion</h4>
                <p><strong>${champs.worst.name}</strong></p>
                <p>Win Rate: ${champs.worst.winRate}%</p>
                <p>Games: ${champs.worst.games}</p>
                <p>Avg KDA: ${worstAvgKDA}</p>
            `;
        }

        // Display graphs
        const graphsContainer = document.getElementById('graphs-container');
        console.log('Graphs Data:', data.data.graphs);
        console.log('Graphs Container:', graphsContainer);
        
        graphsContainer.innerHTML = '';

        if (data.data.graphs.kdaTrend) {
            const kdaItem = document.createElement('div');
            kdaItem.className = 'graph-item';
            kdaItem.innerHTML = `
                <img src="${data.data.graphs.kdaTrend}" alt="K/D/A Trend">
                <p>📊 K/D/A Trend Over Last ${matchCount} Matches</p>
            `;
            graphsContainer.appendChild(kdaItem);
        }

        if (data.data.graphs.championPerformance) {
            const champItem = document.createElement('div');
            champItem.className = 'graph-item';
            champItem.innerHTML = `
                <img src="${data.data.graphs.championPerformance}" alt="Champion Performance">
                <p>🎯 Champion Performance Breakdown</p>
            `;
            graphsContainer.appendChild(champItem);
        }

        // Display roasts
        const analysisRoastEl = document.getElementById('analysis-roast');
        const analysisReportEl = document.getElementById('analysis-report');
        
        if (analysisRoastEl) {
            analysisRoastEl.textContent = data.data.roast;
        }
        if (analysisReportEl) {
            analysisReportEl.textContent = data.data.championReport;
        }

        // Show result
        const analysisResultContainer = document.getElementById('analysis-result');
        if (analysisResultContainer) {
            analysisResultContainer.style.display = 'block';

            // Scroll to results
            setTimeout(() => {
                analysisResultContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`❌ ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔥 League Roaster Bot Frontend Loaded');
    console.log(`📡 API Base URL: ${API_BASE_URL}`);
    
    // Check if user is already registered
    if (UserStorage.isRegistered()) {
        console.log('✅ User found in localStorage');
        updateUIForAuthenticatedUser();
    } else {
        console.log('📝 No user found, showing auth modal');
        showAuthModal();
    }
});