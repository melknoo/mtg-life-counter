import { useState, useCallback } from 'react'
import './App.css'

const PLAYER_COLORS = ['#E8C840', '#D94040', '#8B4DC8', '#3A6FD8']

const PRESET_COLORS = [
  '#E8C840', '#D94040', '#8B4DC8', '#3A6FD8',
  '#3AAD6F', '#E87C40', '#40C8C8', '#C840A0',
  '#2C2C2C', '#8B6914', '#1A6B3A', '#7A1A1A',
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

  const rotations = [180, 180, 0, 0]

  return (
    <div className="app">
      <div className="grid">
        {players.map((player, idx) => (
          <PlayerPanel
            key={player.id}
            player={player}
            rotation={rotations[idx]}
            onAdjust={(delta) => adjustLife(player.id, delta)}
            onOpenEdit={(mode) => openEdit(player.id, mode)}
            cmdDmgTotal={Object.values(cmdDmg[player.id]).reduce((a, b) => a + b, 0)}
          />
        ))}
        <button className="center-btn" onClick={resetAll} title="Alles zurücksetzen">↺</button>
      </div>

      {editingPlayer && editingPlayer.mode === 'name' && (
        <Modal onClose={() => setEditingPlayer(null)}>
          <div className="modal-content">
            <h3>Name ändern</h3>
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
        <Modal onClose={() => setEditingPlayer(null)}>
          <div className="modal-content">
            <h3>Farbe wählen</h3>
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
              <label>Eigene Farbe:</label>
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
        <Modal onClose={() => setEditingPlayer(null)}>
          <CmdDmgPanel
            victimId={editingPlayer.id}
            players={players}
            cmdDmg={cmdDmg}
            onAdjust={adjustCmdDmg}
            onClose={() => setEditingPlayer(null)}
          />
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
      <button className="btn-minus" onClick={() => onAdjust(-1)}>−</button>
      <button className="btn-plus" onClick={() => onAdjust(+1)}>+</button>

      <div className="panel-center">
        <button className="player-name" onClick={() => onOpenEdit('name')}>
          {player.name}
        </button>
        <div className="life-total">{player.life}</div>
        <div className="panel-actions">
          <button className="action-btn" onClick={() => onOpenEdit('color')}>
            🎨
          </button>
          <button className="action-btn" onClick={() => onOpenEdit('cmddmg')}>
            ⚔{cmdDmgTotal > 0 && <span className="cmd-badge">{cmdDmgTotal}</span>}
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
      <h3>Commander Damage</h3>
      <p className="cmddmg-victim">Schaden an: <strong>{victim.name}</strong></p>
      {attackers.map(attacker => (
        <div key={attacker.id} className="cmddmg-row">
          <div className="cmddmg-attacker" style={{ background: attacker.color }}>
            {attacker.name}
          </div>
          <div className="cmddmg-controls">
            <button onClick={() => onAdjust(victimId, attacker.id, -1)}>−</button>
            <span className={`cmddmg-val${cmdDmg[victimId][attacker.id] >= 21 ? ' lethal' : ''}`}>
              {cmdDmg[victimId][attacker.id]}
            </span>
            <button onClick={() => onAdjust(victimId, attacker.id, +1)}>+</button>
          </div>
        </div>
      ))}
      <div className="modal-buttons">
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {children}
      </div>
    </div>
  )
}
