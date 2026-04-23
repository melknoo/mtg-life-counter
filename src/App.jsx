import { useState, useCallback } from 'react'
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

const PLAYER_COLORS = ['#F2D49B', '#E88A8A', '#C8B4E0', '#A8C4E8']

const PRESET_COLORS = [
  '#F2D49B', '#E88A8A', '#C8B4E0', '#A8C4E8',
  '#B8D8B8', '#F2B989', '#9BD8D8', '#D89BC0',
  '#3A3A3A', '#A68B5B', '#6B8B6B', '#9B5858',
]

const STARTING_LIFE = 40

const initialPlayers = [
  { id: 0, name: 'Spieler 1', life: STARTING_LIFE, color: PLAYER_COLORS[0] },
  { id: 1, name: 'Spieler 2', life: STARTING_LIFE, color: PLAYER_COLORS[1] },
  { id: 2, name: 'Spieler 3', life: STARTING_LIFE, color: PLAYER_COLORS[2] },
  { id: 3, name: 'Spieler 4', life: STARTING_LIFE, color: PLAYER_COLORS[3] },
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
  const [players, setPlayers] = useState(initialPlayers)
  const [cmdDmg, setCmdDmg] = useState(initCmdDmg)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [tempName, setTempName] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [layout, setLayout] = useState('standard')

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

  const setPlayerColor = useCallback((id, color) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, color } : p))
  }, [])

  const openEdit = (id, mode) => {
    if (mode === 'name') setTempName(players.find(p => p.id === id).name)
    setEditingPlayer({ id, mode })
  }

  const saveName = () => {
    if (tempName.trim()) {
      setPlayers(prev => prev.map(p =>
        p.id === editingPlayer.id ? { ...p, name: tempName.trim() } : p
      ))
    }
    setEditingPlayer(null)
  }

  const resetAll = () => {
    setPlayers(prev => prev.map((p, i) => ({
      ...initialPlayers[i],
      color: p.color,
      name: p.name,
    })))
    setCmdDmg(initCmdDmg())
    setEditingPlayer(null)
  }

  const rotations = layout === 'sides' ? [180, -90, 90, 0] : [180, 180, 0, 0]

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
        <button className="center-btn" onClick={() => setMenuOpen(true)} aria-label="Menü">
          <IconCrown size={32} color="#000"/>
        </button>
      </div>

      {editingPlayer && editingPlayer.mode === 'name' && (
        <Modal title="NAME ÄNDERN" onClose={() => setEditingPlayer(null)}>
          <div className="modal-content">
            <input
              className="name-input"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              maxLength={16}
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

      {menuOpen && (
        <Modal title="MENÜ" onClose={() => setMenuOpen(false)}>
          <div className="modal-content menu-panel">
            <div className="menu-buttons">
              <button onClick={() => { resetAll(); setMenuOpen(false) }}>
                <IconReset size={14} color="rgba(0,0,0,0.75)"/>
                Zurücksetzen
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
                Einer oben, zwei Mitte, einer unten
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function PlayerPanel({ player, rotation, onAdjust, onOpenEdit, cmdDmgTotal }) {
  return (
    <div
      className="player-panel"
      style={{ background: player.color, transform: `rotate(${rotation}deg)` }}
    >
      <button className="btn-minus" onClick={() => onAdjust(-1)} aria-label="minus">−</button>
      <button className="btn-plus" onClick={() => onAdjust(+1)} aria-label="plus">+</button>

      <div className="panel-center">
        <button className="player-name" onClick={() => onOpenEdit('name')}>
          {player.name}
        </button>
        <div className="life-total">{player.life}</div>
        <div className="panel-actions">
          <button className="action-btn" onClick={() => onOpenEdit('color')} aria-label="Farbe">
            <IconPalette size={16} color="rgba(0,0,0,0.75)"/>
          </button>
          <button className="action-btn" onClick={() => onOpenEdit('cmddmg')} aria-label="Commander Damage">
            <IconCrown size={16} color="rgba(0,0,0,0.85)"/>
            {cmdDmgTotal > 0 && <span className="cmd-badge">{cmdDmgTotal}</span>}
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
