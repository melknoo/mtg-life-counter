import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

const PX = { imageRendering: 'pixelated', shapeRendering: 'crispEdges', display: 'block' }

function IconPalette({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="2" y="0" width="4" height="1"/>
      <rect x="1" y="1" width="6" height="1"/>
      <rect x="0" y="2" width="8" height="3"/>
      <rect x="1" y="5" width="5" height="1"/>
      <rect x="2" y="6" width="3" height="1"/>
    </svg>
  )
}

function IconCrown({ size = 18, color = '#000' }) {
  return (
    <svg width={size * 1.23} height={size} viewBox="0 0 16 13" fill={color} style={PX}>
      <rect x="1" y="1" width="2" height="1"/>
      <rect x="1" y="2" width="2" height="2"/>
      <rect x="7" y="0" width="2" height="1"/>
      <rect x="7" y="1" width="2" height="3"/>
      <rect x="13" y="1" width="2" height="1"/>
      <rect x="13" y="2" width="2" height="2"/>
      <rect x="1" y="4" width="14" height="1"/>
      <rect x="0" y="5" width="16" height="4"/>
      <rect x="2" y="6" width="2" height="2" fill="#E88A8A"/>
      <rect x="7" y="6" width="2" height="2" fill="#A8C4E8"/>
      <rect x="12" y="6" width="2" height="2" fill="#F2D49B"/>
      <rect x="0" y="9" width="16" height="1"/>
      <rect x="1" y="10" width="2" height="1"/>
      <rect x="7" y="10" width="2" height="1"/>
      <rect x="13" y="10" width="2" height="1"/>
    </svg>
  )
}

function IconReset({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="2" y="1" width="4" height="1"/>
      <rect x="1" y="2" width="1" height="4"/>
      <rect x="6" y="2" width="1" height="3"/>
      <rect x="2" y="6" width="4" height="1"/>
      <rect x="4" y="3" width="1" height="1"/>
      <rect x="5" y="4" width="2" height="1"/>
    </svg>
  )
}

function IconGrid({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="0" y="0" width="3" height="3"/>
      <rect x="5" y="0" width="3" height="3"/>
      <rect x="0" y="5" width="3" height="3"/>
      <rect x="5" y="5" width="3" height="3"/>
    </svg>
  )
}

function IconSides({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="0" y="0" width="8" height="2"/>
      <rect x="0" y="3" width="3" height="2"/>
      <rect x="5" y="3" width="3" height="2"/>
      <rect x="0" y="6" width="8" height="2"/>
    </svg>
  )
}

// Sword with blade, crossguard, handle and pommel — clearly distinct from a die
function IconSword({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 6 8" fill={color} style={PX}>
      <rect x="2" y="0" width="2" height="3"/>
      <rect x="0" y="3" width="6" height="1"/>
      <rect x="2" y="4" width="2" height="2"/>
      <rect x="1" y="6" width="4" height="2"/>
    </svg>
  )
}

// Die (d6) icon — clearly means "counters/tracking"
function IconDie({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="0" y="0" width="8" height="1"/>
      <rect x="0" y="7" width="8" height="1"/>
      <rect x="0" y="1" width="1" height="6"/>
      <rect x="7" y="1" width="1" height="6"/>
      <rect x="2" y="2" width="1" height="1"/>
      <rect x="5" y="2" width="1" height="1"/>
      <rect x="2" y="5" width="1" height="1"/>
      <rect x="5" y="5" width="1" height="1"/>
    </svg>
  )
}

function IconHome({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill={color} style={PX}>
      <rect x="3" y="0" width="2" height="1"/>
      <rect x="2" y="1" width="4" height="1"/>
      <rect x="1" y="2" width="6" height="1"/>
      <rect x="0" y="3" width="8" height="1"/>
      <rect x="1" y="4" width="6" height="4"/>
      <rect x="3" y="5" width="2" height="3"/>
    </svg>
  )
}

function ToggleSwitch({ active, onChange }) {
  return (
    <div
      className={`toggle-switch${active ? ' on' : ''}`}
      onClick={onChange}
      role="checkbox"
      aria-checked={active}
    >
      <div className="toggle-knob"/>
    </div>
  )
}

const PLAYER_COLORS = ['#F2D49B', '#E88A8A', '#C8B4E0', '#A8C4E8']

const PRESET_COLORS = [
  '#F2D49B', '#E88A8A', '#C8B4E0', '#A8C4E8',
  '#B8D8B8', '#F2B989', '#9BD8D8', '#D89BC0',
  '#3A3A3A', '#A68B5B', '#6B8B6B', '#9B5858',
]

const STARTING_LIFE = 40

const makeInitialPlayers = () => [
  { id: 0, name: 'Spieler 1', life: STARTING_LIFE, color: PLAYER_COLORS[0], commander: '', poison: 0, experience: 0, isMonarch: false, hasInitiative: false, hasCitysBlessing: false, customTrackers: [] },
  { id: 1, name: 'Spieler 2', life: STARTING_LIFE, color: PLAYER_COLORS[1], commander: '', poison: 0, experience: 0, isMonarch: false, hasInitiative: false, hasCitysBlessing: false, customTrackers: [] },
  { id: 2, name: 'Spieler 3', life: STARTING_LIFE, color: PLAYER_COLORS[2], commander: '', poison: 0, experience: 0, isMonarch: false, hasInitiative: false, hasCitysBlessing: false, customTrackers: [] },
  { id: 3, name: 'Spieler 4', life: STARTING_LIFE, color: PLAYER_COLORS[3], commander: '', poison: 0, experience: 0, isMonarch: false, hasInitiative: false, hasCitysBlessing: false, customTrackers: [] },
]

const initCmdDmg = () => {
  const d = {}
  for (let i = 0; i < 4; i++) {
    d[i] = {}
    for (let j = 0; j < 4; j++) {
      if (i !== j) d[i][j] = 0
    }
  }
  return d
}

export default function App() {
  const [currentView, setCurrentView] = useState('home')
  const [players, setPlayers] = useState(makeInitialPlayers)
  const [cmdDmg, setCmdDmg] = useState(initCmdDmg)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [tempName, setTempName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [layout, setLayout] = useState('standard')
  const [isDay, setIsDay] = useState(true)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [savingRound, setSavingRound] = useState(false)
  const [tempRoundName, setTempRoundName] = useState('')
  const [savedRounds, setSavedRounds] = useState(() =>
    JSON.parse(localStorage.getItem('mtg-rounds') || '[]')
  )

  useEffect(() => {
    localStorage.setItem('mtg-rounds', JSON.stringify(savedRounds))
  }, [savedRounds])

  const adjustLife = useCallback((id, delta) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, life: p.life + delta } : p))
  }, [])

  const adjustCmdDmg = useCallback((victimId, attackerId, delta) => {
    setCmdDmg(prev => {
      const next = { ...prev, [victimId]: { ...prev[victimId] } }
      next[victimId][attackerId] = Math.max(0, (next[victimId][attackerId] || 0) + delta)
      return next
    })
    setPlayers(prev => prev.map(p => p.id === victimId ? { ...p, life: p.life - delta } : p))
  }, [])

  const adjustPoison = useCallback((id, delta) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, poison: Math.max(0, p.poison + delta) } : p))
  }, [])

  const adjustExperience = useCallback((id, delta) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, experience: Math.max(0, p.experience + delta) } : p))
  }, [])

  const setMonarch = useCallback((id) => {
    setPlayers(prev => prev.map(p => ({ ...p, isMonarch: p.id === id ? !p.isMonarch : false })))
  }, [])

  const setInitiative = useCallback((id) => {
    setPlayers(prev => prev.map(p => ({ ...p, hasInitiative: p.id === id ? !p.hasInitiative : false })))
  }, [])

  const toggleCitysBlessing = useCallback((id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, hasCitysBlessing: !p.hasCitysBlessing } : p))
  }, [])

  const adjustCustomCounter = useCallback((playerId, trackerId, delta) => {
    setPlayers(prev => prev.map(p => p.id !== playerId ? p : {
      ...p,
      customTrackers: p.customTrackers.map(t =>
        t.id === trackerId ? { ...t, value: Math.max(0, t.value + delta) } : t
      )
    }))
  }, [])

  const toggleCustomSwitch = useCallback((playerId, trackerId) => {
    setPlayers(prev => prev.map(p => p.id !== playerId ? p : {
      ...p,
      customTrackers: p.customTrackers.map(t =>
        t.id === trackerId ? { ...t, value: !t.value } : t
      )
    }))
  }, [])

  const addCustomTracker = useCallback((playerId, type, label) => {
    setPlayers(prev => prev.map(p => p.id !== playerId ? p : {
      ...p,
      customTrackers: [...p.customTrackers, {
        id: Date.now(),
        label: label.trim(),
        type,
        value: type === 'toggle' ? false : 0
      }]
    }))
  }, [])

  const removeCustomTracker = useCallback((playerId, trackerId) => {
    setPlayers(prev => prev.map(p => p.id !== playerId ? p : {
      ...p,
      customTrackers: p.customTrackers.filter(t => t.id !== trackerId)
    }))
  }, [])

  const setPlayerColor = useCallback((id, color) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, color } : p))
  }, [])

  const openEdit = (id, mode) => {
    const player = players.find(p => p.id === id)
    if (mode === 'name') setTempName(player.name)
    if (mode === 'commander') setTempName(player.commander)
    setEditingPlayer({ id, mode })
  }

  const saveName = () => {
    if (editingPlayer.mode === 'commander') {
      setPlayers(prev => prev.map(p =>
        p.id === editingPlayer.id ? { ...p, commander: tempName.trim() } : p
      ))
    } else if (tempName.trim()) {
      setPlayers(prev => prev.map(p =>
        p.id === editingPlayer.id ? { ...p, name: tempName.trim() } : p
      ))
    }
    setEditingPlayer(null)
  }

  const resetAll = () => {
    setPlayers(prev => prev.map((p, i) => ({
      ...makeInitialPlayers()[i],
      color: p.color,
      name: p.name,
      commander: p.commander,
      customTrackers: p.customTrackers.map(t => ({
        ...t,
        value: t.type === 'toggle' ? false : 0
      }))
    })))
    setCmdDmg(initCmdDmg())
    setIsDay(true)
    setEditingPlayer(null)
  }

  const saveRound = useCallback((name) => {
    if (!name.trim()) return
    setSavedRounds(prev => [...prev, {
      id: Date.now(),
      name: name.trim(),
      players: players.map(p => ({ name: p.name, color: p.color })),
    }])
  }, [players])

  const loadRound = useCallback((round) => {
    setPlayers(prev => prev.map((p, i) => ({
      ...makeInitialPlayers()[i],
      name: round.players[i].name,
      color: round.players[i].color,
      customTrackers: prev[i].customTrackers.map(t => ({
        ...t,
        value: t.type === 'toggle' ? false : 0
      }))
    })))
    setCmdDmg(initCmdDmg())
    setIsDay(true)
  }, [])

  const deleteRound = useCallback((id) => {
    setSavedRounds(prev => prev.filter(r => r.id !== id))
  }, [])

  const rotations = layout === 'sides' ? [180, -90, 90, 0] : [180, 180, 0, 0]

  if (currentView === 'home') {
    return (
      <div className="app">
        <HomeScreen
          layout={layout}
          onSetLayout={setLayout}
          savedRounds={savedRounds}
          onNewGame={() => { resetAll(); setCurrentView('game') }}
          onLoadRound={(round) => { loadRound(round); setCurrentView('game') }}
          onDeleteRound={deleteRound}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <div className={`grid layout-${layout}`}>
        {players.map((player, idx) => (
          <div key={player.id} className="cell">
            <PlayerPanel
              player={player}
              rotation={rotations[idx]}
              onAdjust={(delta) => adjustLife(player.id, delta)}
              onOpenEdit={(mode) => openEdit(player.id, mode)}
              cmdDmgTotal={Object.values(cmdDmg[player.id]).reduce((a, b) => a + b, 0)}
            />
          </div>
        ))}
        <button className={`center-btn${isDay ? '' : ' night'}`} onClick={() => setMenuOpen(true)} aria-label="Menü">
          <span className="day-icon">{isDay ? '☀' : '☽'}</span>
          <IconCrown size={26} color="#000"/>
        </button>
      </div>

      {editingPlayer && (editingPlayer.mode === 'name' || editingPlayer.mode === 'commander') && (
        <Modal
          title={editingPlayer.mode === 'commander' ? 'COMMANDER' : 'NAME ÄNDERN'}
          onClose={() => setEditingPlayer(null)}
        >
          <div className="modal-content">
            <input
              className="name-input"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              maxLength={24}
              placeholder={editingPlayer.mode === 'commander' ? 'Commander-Name...' : ''}
            />
            <div className="modal-buttons">
              <button onClick={saveName}>Speichern</button>
              <button onClick={() => setEditingPlayer(null)}>Abbrechen</button>
            </div>
          </div>
        </Modal>
      )}

      {editingPlayer && editingPlayer.mode === 'color' && (
        <Modal title="FARBE WÄHLEN" onClose={() => setEditingPlayer(null)}>
          <div className="modal-content">
            <div className="color-grid">
              {PRESET_COLORS.map(color => (
                <div
                  key={color}
                  className={`color-swatch${players.find(p => p.id === editingPlayer.id).color === color ? ' selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => { setPlayerColor(editingPlayer.id, color); setEditingPlayer(null) }}
                />
              ))}
            </div>
            <div className="custom-color">
              <label>EIGENE FARBE &gt;</label>
              <input
                type="color"
                value={players.find(p => p.id === editingPlayer.id).color}
                onChange={e => setPlayerColor(editingPlayer.id, e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={() => setEditingPlayer(null)}>Fertig</button>
            </div>
          </div>
        </Modal>
      )}

      {editingPlayer && editingPlayer.mode === 'cmddmg' && (
        <Modal title="COMMANDER DAMAGE" onClose={() => setEditingPlayer(null)}>
          <CmdDmgPanel
            victimId={editingPlayer.id}
            players={players}
            cmdDmg={cmdDmg}
            onAdjust={adjustCmdDmg}
            onClose={() => setEditingPlayer(null)}
          />
        </Modal>
      )}

      {editingPlayer && editingPlayer.mode === 'counters' && (
        <Modal title="ZÄHLER" onClose={() => setEditingPlayer(null)}>
          <CountersPanel
            player={players.find(p => p.id === editingPlayer.id)}
            onAdjustPoison={(delta) => adjustPoison(editingPlayer.id, delta)}
            onAdjustExperience={(delta) => adjustExperience(editingPlayer.id, delta)}
            onSetMonarch={() => setMonarch(editingPlayer.id)}
            onSetInitiative={() => setInitiative(editingPlayer.id)}
            onToggleCitysBlessing={() => toggleCitysBlessing(editingPlayer.id)}
            onAdjustCustom={(trackerId, delta) => adjustCustomCounter(editingPlayer.id, trackerId, delta)}
            onToggleCustom={(trackerId) => toggleCustomSwitch(editingPlayer.id, trackerId)}
            onAddCustom={(type, label) => addCustomTracker(editingPlayer.id, type, label)}
            onRemoveCustom={(trackerId) => removeCustomTracker(editingPlayer.id, trackerId)}
            onClose={() => setEditingPlayer(null)}
          />
        </Modal>
      )}

      {menuOpen && (
        <Modal title="MENÜ" onClose={() => setMenuOpen(false)}>
          <div className="modal-content menu-panel">
            <div className="menu-buttons">
              <button onClick={() => { setMenuOpen(false); setConfirmingReset(true) }}>
                <IconReset size={14} color="rgba(0,0,0,0.75)"/>
                Zurücksetzen
              </button>
              <button onClick={() => { setSavingRound(true); setTempRoundName(''); setMenuOpen(false) }}>
                Runde speichern
              </button>
            </div>
            <div className="menu-section-title">Sitzordnung</div>
            <div className="menu-buttons">
              <button className={layout === 'standard' ? 'active' : ''} onClick={() => setLayout('standard')}>
                <IconGrid size={14} color="rgba(0,0,0,0.75)"/>
                Standard (2×2)
              </button>
              <button className={layout === 'sides' ? 'active' : ''} onClick={() => setLayout('sides')}>
                <IconSides size={14} color="rgba(0,0,0,0.75)"/>
                Kreuz
              </button>
            </div>
            <div className="menu-section-title">Tag / Nacht</div>
            <div className="menu-buttons">
              <button onClick={() => setIsDay(prev => !prev)}>
                {isDay ? '☀ TAG → Nacht wechseln' : '☽ NACHT → Tag wechseln'}
              </button>
            </div>
            <div className="menu-section-title">Navigation</div>
            <div className="menu-buttons">
              <button onClick={() => { setMenuOpen(false); setCurrentView('home') }}>
                <IconHome size={14} color="rgba(0,0,0,0.75)"/>
                Hauptmenü
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmingReset && (
        <Modal title="ZURÜCKSETZEN?" onClose={() => setConfirmingReset(false)}>
          <div className="modal-content">
            <p className="confirm-text">Alle Lebenspunkte und Zähler werden zurückgesetzt.</p>
            <div className="modal-buttons">
              <button onClick={() => { resetAll(); setConfirmingReset(false) }}>Ja</button>
              <button onClick={() => setConfirmingReset(false)}>Abbrechen</button>
            </div>
          </div>
        </Modal>
      )}

      {savingRound && (
        <Modal title="RUNDE SPEICHERN" onClose={() => setSavingRound(false)}>
          <div className="modal-content">
            <input
              className="name-input"
              value={tempRoundName}
              onChange={e => setTempRoundName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { saveRound(tempRoundName); setSavingRound(false) } }}
              autoFocus
              maxLength={24}
              placeholder="Name der Runde..."
            />
            <div className="modal-buttons">
              <button onClick={() => { saveRound(tempRoundName); setSavingRound(false) }}>Speichern</button>
              <button onClick={() => setSavingRound(false)}>Abbrechen</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function HomeScreen({ layout, onSetLayout, savedRounds, onNewGame, onLoadRound, onDeleteRound }) {
  return (
    <div className="home-screen">
      <div className="home-logo">
        <IconCrown size={52} color="#F2D49B"/>
      </div>
      <h1 className="home-title">MTG LIFE COUNTER</h1>

      <div className="home-section">
        <div className="home-section-label">Sitzordnung</div>
        <div className="home-layout-btns">
          <button
            className={`home-layout-btn${layout === 'standard' ? ' active' : ''}`}
            onClick={() => onSetLayout('standard')}
          >
            <IconGrid size={14} color="rgba(0,0,0,0.75)"/>
            Standard (2×2)
          </button>
          <button
            className={`home-layout-btn${layout === 'sides' ? ' active' : ''}`}
            onClick={() => onSetLayout('sides')}
          >
            <IconSides size={14} color="rgba(0,0,0,0.75)"/>
            Kreuz
          </button>
        </div>
      </div>

      <button className="home-new-game" onClick={onNewGame}>
        ▶ Neues Spiel
      </button>

      {savedRounds.length > 0 && (
        <div className="home-section home-rounds-section">
          <div className="home-section-label">Gespeicherte Runden</div>
          <div className="home-rounds-list">
            {savedRounds.map(r => (
              <div key={r.id} className="home-round-row">
                <div className="home-round-info">
                  <div className="home-round-name">{r.name}</div>
                  <div className="home-round-players">
                    {r.players.map((p, i) => (
                      <span key={i} className="home-player-dot" style={{ background: p.color }} title={p.name}/>
                    ))}
                    <span className="home-round-names-text">{r.players.map(p => p.name).join(', ')}</span>
                  </div>
                </div>
                <div className="home-round-actions">
                  <button onClick={() => onLoadRound(r)}>Laden</button>
                  <button className="home-delete-btn" onClick={() => onDeleteRound(r.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerPanel({ player, rotation, onAdjust, onOpenEdit, cmdDmgTotal }) {
  const holdTimerRef = useRef(null)
  const holdIntervalRef = useRef(null)

  const startAdjust = (delta) => {
    onAdjust(delta)
    holdTimerRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => onAdjust(delta > 0 ? 10 : -10), 150)
    }, 500)
  }

  const stopAdjust = () => {
    clearTimeout(holdTimerRef.current)
    clearInterval(holdIntervalRef.current)
  }

  const hasCustomActive = player.customTrackers.some(t =>
    t.type === 'toggle' ? t.value : t.value > 0
  )
  const hasStatus = player.poison > 0 || player.experience > 0 || player.isMonarch || player.hasInitiative || player.hasCitysBlessing || hasCustomActive

  return (
    <div
      className="player-panel"
      style={{ background: player.color, transform: `rotate(${rotation}deg)` }}
    >
      <button
        className="btn-minus"
        onPointerDown={() => startAdjust(-1)}
        onPointerUp={stopAdjust}
        onPointerLeave={stopAdjust}
        onPointerCancel={stopAdjust}
        aria-label="minus"
      >−</button>
      <button
        className="btn-plus"
        onPointerDown={() => startAdjust(1)}
        onPointerUp={stopAdjust}
        onPointerLeave={stopAdjust}
        onPointerCancel={stopAdjust}
        aria-label="plus"
      >+</button>

      <div className="panel-center">
        <button className="player-name" onClick={() => onOpenEdit('name')}>
          {player.name}
        </button>
        {player.commander && (
          <div className="commander-name">&gt; {player.commander}</div>
        )}
        <div className="life-total">{player.life}</div>
        {hasStatus && (
          <div className="panel-status">
            {player.poison > 0 && (
              <span className={`counter-badge poison${player.poison >= 10 ? ' lethal' : ''}`}>
                ☠{player.poison}
              </span>
            )}
            {player.experience > 0 && (
              <span className="counter-badge exp">✦{player.experience}</span>
            )}
            {player.isMonarch && <span className="status-badge">♛</span>}
            {player.hasInitiative && <span className="status-badge">⚔</span>}
            {player.hasCitysBlessing && <span className="status-badge">✦</span>}
            {player.customTrackers.map(t => {
              if (t.type === 'toggle' && t.value) {
                return <span key={t.id} className="status-badge">{t.label.substring(0, 3).toUpperCase()}</span>
              }
              if (t.type === 'counter' && t.value > 0) {
                return <span key={t.id} className="counter-badge">{t.label.substring(0, 2).toUpperCase()}{t.value}</span>
              }
              return null
            })}
          </div>
        )}
        <div className="panel-actions">
          <button className="action-btn" onClick={() => onOpenEdit('color')} aria-label="Farbe">
            <IconPalette size={14} color="rgba(0,0,0,0.75)"/>
          </button>
          <button className="action-btn" onClick={() => onOpenEdit('cmddmg')} aria-label="Commander Damage">
            <IconCrown size={14} color="rgba(0,0,0,0.85)"/>
            {cmdDmgTotal > 0 && <span className="cmd-badge">{cmdDmgTotal}</span>}
          </button>
          <button className="action-btn" onClick={() => onOpenEdit('counters')} aria-label="Zähler">
            <IconDie size={14} color="rgba(0,0,0,0.75)"/>
          </button>
          <button className="action-btn" onClick={() => onOpenEdit('commander')} aria-label="Commander">
            <IconSword size={14} color="rgba(0,0,0,0.75)"/>
          </button>
        </div>
      </div>
    </div>
  )
}

function CmdDmgPanel({ victimId, players, cmdDmg, onAdjust, onClose }) {
  const victim = players.find(p => p.id === victimId)
  const attackers = players.filter(p => p.id !== victimId)

  return (
    <div className="modal-content cmddmg-panel">
      <p className="cmddmg-victim">SCHADEN AN &gt; <strong>{victim.name}</strong></p>
      {attackers.map(attacker => {
        const val = cmdDmg[victimId][attacker.id]
        const padded = String(val).padStart(2, '0')
        return (
          <div key={attacker.id} className="cmddmg-row">
            <div className="cmddmg-attacker" style={{ background: attacker.color }}>
              {attacker.name}
            </div>
            <div className="cmddmg-controls">
              <button onClick={() => onAdjust(victimId, attacker.id, -1)}>−</button>
              <span className={`cmddmg-val${val >= 21 ? ' lethal' : ''}`}>{padded}</span>
              <button onClick={() => onAdjust(victimId, attacker.id, +1)}>+</button>
            </div>
          </div>
        )
      })}
      <div className="modal-buttons">
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  )
}

function CountersPanel({ player, onAdjustPoison, onAdjustExperience, onSetMonarch, onSetInitiative, onToggleCitysBlessing, onAdjustCustom, onToggleCustom, onAddCustom, onRemoveCustom, onClose }) {
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newType, setNewType] = useState('counter')

  const handleAdd = () => {
    if (!newLabel.trim()) return
    onAddCustom(newType, newLabel)
    setNewLabel('')
    setAdding(false)
  }

  return (
    <div className="modal-content counters-panel">
      <div className="counter-row">
        <div className="counter-label">GIFT ☠</div>
        <div className="cmddmg-controls">
          <button onClick={() => onAdjustPoison(-1)}>−</button>
          <span className={`cmddmg-val${player.poison >= 10 ? ' lethal' : ''}`}>
            {String(player.poison).padStart(2, '0')}
          </span>
          <button onClick={() => onAdjustPoison(1)}>+</button>
        </div>
      </div>
      <div className="counter-row">
        <div className="counter-label">ERFAHRUNG ✦</div>
        <div className="cmddmg-controls">
          <button onClick={() => onAdjustExperience(-1)}>−</button>
          <span className="cmddmg-val">{String(player.experience).padStart(2, '0')}</span>
          <button onClick={() => onAdjustExperience(1)}>+</button>
        </div>
      </div>
      <div className="counter-row">
        <div className="counter-label">MONARCH ♛</div>
        <ToggleSwitch active={player.isMonarch} onChange={onSetMonarch}/>
      </div>
      <div className="counter-row">
        <div className="counter-label">INITIATIVE ⚔</div>
        <ToggleSwitch active={player.hasInitiative} onChange={onSetInitiative}/>
      </div>
      <div className="counter-row">
        <div className="counter-label">CITY'S BLESSING ✦</div>
        <ToggleSwitch active={player.hasCitysBlessing} onChange={onToggleCitysBlessing}/>
      </div>

      {player.customTrackers.length > 0 && (
        <div className="custom-trackers-section">
          <div className="custom-divider"/>
          {player.customTrackers.map(tracker => (
            <div key={tracker.id} className="counter-row">
              <div className="counter-label">{tracker.label.toUpperCase()}</div>
              {tracker.type === 'toggle' ? (
                <ToggleSwitch active={tracker.value} onChange={() => onToggleCustom(tracker.id)}/>
              ) : (
                <div className="cmddmg-controls">
                  <button onClick={() => onAdjustCustom(tracker.id, -1)}>−</button>
                  <span className="cmddmg-val">{String(tracker.value).padStart(2, '0')}</span>
                  <button onClick={() => onAdjustCustom(tracker.id, 1)}>+</button>
                </div>
              )}
              <button className="remove-tracker-btn" onClick={() => onRemoveCustom(tracker.id)}>×</button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="add-tracker-form">
          <input
            className="name-input"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Name..."
            maxLength={16}
            autoFocus
          />
          <div className="tracker-type-row">
            <button
              className={`type-btn${newType === 'counter' ? ' active' : ''}`}
              onClick={() => setNewType('counter')}
            >
              ZÄHLER
            </button>
            <button
              className={`type-btn${newType === 'toggle' ? ' active' : ''}`}
              onClick={() => setNewType('toggle')}
            >
              AN/AUS
            </button>
          </div>
          <div className="modal-buttons">
            <button onClick={handleAdd}>Hinzufügen</button>
            <button onClick={() => { setAdding(false); setNewLabel('') }}>Abbrechen</button>
          </div>
        </div>
      ) : (
        <button className="add-tracker-btn" onClick={() => setAdding(true)}>
          + EIGENER ZÄHLER
        </button>
      )}

      <div className="modal-buttons">
        <button onClick={onClose}>Fertig</button>
      </div>
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-titlebar">
          <span>&gt; {title}</span>
          <span className="modal-close" onClick={onClose}>×</span>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
