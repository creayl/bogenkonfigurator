import { useConfigurator } from '../../state/ConfiguratorContext.jsx';
import { ACTIONS } from '../../state/reducer.js';
import { buildEmail } from '../../lib/emailBuilder.js';

export default function EmailInquiry() {
  const { product, state, dispatch } = useConfigurator();

  function onSend() {
    if (!product) return;
    const href = buildEmail({
      product,
      state,
      recipient: state.ui.emailRecipient
    });
    window.location.href = href;
  }

  return (
    <div className="space-y-2">
      <input
        type="email"
        value={state.ui.emailRecipient}
        onChange={(e) =>
          dispatch({ type: ACTIONS.SET_EMAIL_RECIPIENT, value: e.target.value })
        }
        placeholder="empfaenger@beispiel.de"
        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
      />
      <button
        type="button"
        onClick={onSend}
        className="w-full px-4 py-2 rounded bg-neutral-900 text-white hover:bg-neutral-700 transition"
      >
        Als E-Mail-Anfrage senden
      </button>
    </div>
  );
}
