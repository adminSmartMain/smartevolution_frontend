import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

const normalizeResponseData = (response) => {
  return response?.data?.data ?? response?.data ?? response;
};

const isValidDraftPayload = (payload) => {
  return Boolean(
    payload?.opId &&
      payload?.opDate &&
      (
        payload?.selectedBills?.length > 0 ||
        payload?.investorAssignments?.length > 0
      )
  );
};

export const useMassiveOperationDraft = ({
  createDraftFetch,
  updateDraftFetch,
}) => {
  const [draftId, setDraftIdState] = useState(null);
  const [draftStatus, setDraftStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const draftIdRef = useRef(null);
  const savingRef = useRef(false);

  const setDraftId = useCallback((id) => {
    draftIdRef.current = id || null;
    setDraftIdState(id || null);
  }, []);

  const saveDraft = useCallback(
    async (payload, options = {}) => {
      const {
        silent = false,
        force = false,
        draftIdOverride = null,
      } = options;

      const currentDraftId = draftIdOverride || draftIdRef.current;

      if (savingRef.current) return null;

      if (!force && !isValidDraftPayload(payload)) {
        if (!silent) {
          toast.warning("Selecciona facturas antes de guardar el borrador.");
        }
        return null;
      }

      try {
        savingRef.current = true;
        setDraftStatus("saving");

        let response;

        if (currentDraftId) {
          response = await updateDraftFetch({
            draftId: currentDraftId,
            payload,
          });
        } else {
          response = await createDraftFetch(payload);
        }

        const data = normalizeResponseData(response);

        if (data?.id && !currentDraftId) {
          setDraftId(data.id);
        }

        setLastSavedAt(new Date());
        setDraftStatus("saved");

        return data;
      } catch (error) {
        console.error("Error guardando borrador:", error);
        setDraftStatus("error");

        if (!silent) {
          toast.error("No fue posible guardar el borrador.");
        }

        return null;
      } finally {
        savingRef.current = false;
      }
    },
    [createDraftFetch, updateDraftFetch, setDraftId]
  );

  const resetDraft = useCallback(() => {
    draftIdRef.current = null;
    setDraftIdState(null);
    setDraftStatus("idle");
    setLastSavedAt(null);
    savingRef.current = false;
  }, []);

  return {
    draftId,
    setDraftId,
    draftStatus,
    lastSavedAt,
    saveDraft,
    resetDraft,
  };
};