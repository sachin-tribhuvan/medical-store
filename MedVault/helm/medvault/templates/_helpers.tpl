{{- define "medvault.namespace" -}}{{ .Values.namespace.name }}{{- end }}
{{- define "medvault.labels" -}}
app.kubernetes.io/name: medvault
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
