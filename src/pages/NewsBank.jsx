/**
 * NewsBank — Banco de noticias guardadas.
 *
 * Muestra las noticias que el Agente 1 descartó del top-3 pero marcó
 * con potencial para posts futuros. El usuario puede:
 *   - Ver el potencial de cada noticia
 *   - Usarla (la lleva al flujo principal desde el paso 2)
 *   - Eliminarla del banco
 *   - Limpiar todo el banco
 */

import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import useStorage      from '@/hooks/useStorage'
import useNewsStore    from '@/stores/newsStore'
import useAppStore     from '@/stores/appStore'
import NewsBankItem    from '@/components/news/NewsBankItem'
import Button          from '@/components/ui/Button'
import EmptyState      from '@/components/ui/EmptyState'
import Modal           from '@/components/ui/Modal'

function NewsBank() {
  const navigate = useNavigate()
  const { newsBank, removeNewsBankItem, clearNewsBank } = useStorage()
  const { setTopNews, selectNews }  = useNewsStore()
  const { resetFlow }               = useAppStore()

  const [confirmClear, setConfirmClear] = useState(false)

  // ─── Acciones ─────────────────────────────────────────────────────────────

  /**
   * Usa la noticia del banco:
   * - La convierte en el top-1 del step 1 (seleccionada automáticamente)
   * - Redirige al dashboard donde el usuario elige formato/longitud
   */
  const handleUse = (item) => {
    // Adapta el item del banco al schema de NewsCard
    const newsItem = {
      id:               item.id,
      title:            item.title,
      source:           item.source,
      url:              item.url,
      date:             item.date,
      summary:          item.future_potential ?? '',
      finlat_relevance: 'Seleccionada desde el banco de noticias.',
      key_data:         '',
      origin:           'banco',
      priority:         'media',
    }
    // Inyecta la noticia como único resultado del paso 1 y la pre-selecciona
    setTopNews([newsItem])
    selectNews(newsItem.id)
    // Reinicia el flujo al paso 1 (Step1Discover mostrará la noticia seleccionada)
    resetFlow()
    navigate('/')
  }

  const handleDelete = (id) => {
    removeNewsBankItem(id)
  }

  const handleClearAll = () => {
    clearNewsBank()
    setConfirmClear(false)
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-smoke tracking-tight">
            Banco de Noticias
          </h1>
          <p className="text-sm text-smoke-muted mt-1">
            Noticias con potencial guardadas automáticamente por la IA.
            Úsalas en cualquier momento para crear un nuevo post.
          </p>
        </div>
        {newsBank.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmClear(true)}
            className="shrink-0 text-danger hover:text-danger"
          >
            Limpiar banco
          </Button>
        )}
      </div>

      {/* Contador */}
      {newsBank.length > 0 && (
        <p className="text-xs text-smoke-muted">
          {newsBank.length} noticia{newsBank.length !== 1 ? 's' : ''} guardada{newsBank.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Lista de noticias */}
      {newsBank.length > 0 ? (
        <div className="bg-gunmetal rounded-card border border-oxford-light/20 px-4 divide-y divide-oxford-light/10">
          {newsBank.map(item => (
            <NewsBankItem
              key={item.id}
              item={item}
              onUse={handleUse}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📭"
          title="El banco está vacío"
          description="Cuando la IA analice noticias y encuentre artículos con potencial para posts futuros, los guardará aquí automáticamente."
        />
      )}

      {/* Modal confirmación limpiar */}
      <Modal
        open={confirmClear}
        title="¿Limpiar el banco de noticias?"
        onClose={() => setConfirmClear(false)}
      >
          <div className="space-y-4">
            <p className="text-sm text-smoke-muted">
              Se eliminarán las {newsBank.length} noticias guardadas. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" size="md" onClick={() => setConfirmClear(false)}>
                Cancelar
              </Button>
              <Button variant="danger" size="md" onClick={handleClearAll}>
                Sí, limpiar todo
              </Button>
            </div>
          </div>
        </Modal>

    </div>
  )
}

export default NewsBank
