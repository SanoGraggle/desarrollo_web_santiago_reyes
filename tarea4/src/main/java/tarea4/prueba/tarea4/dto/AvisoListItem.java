package tarea4.prueba.tarea4.dto;

public class AvisoListItem {
    private Long id;
    private String fecha;
    private String sector;
    private String cantidadTipoEdad;
    private String comuna;
    private Double promedioNota;

    public AvisoListItem() {}

    public AvisoListItem(Long id, String fecha, String sector, String cantidadTipoEdad, String comuna, Double promedioNota) {
        this.id = id;
        this.fecha = fecha;
        this.sector = sector;
        this.cantidadTipoEdad = cantidadTipoEdad;
        this.comuna = comuna;
        this.promedioNota = promedioNota;
    }

    public Long getId() { return id; }
    public String getFecha() { return fecha; }
    public String getSector() { return sector; }
    public String getCantidadTipoEdad() { return cantidadTipoEdad; }
    public String getComuna() { return comuna; }
    public Double getPromedioNota() { return promedioNota; }

    public void setId(Long id) { this.id = id; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public void setSector(String sector) { this.sector = sector; }
    public void setCantidadTipoEdad(String cantidadTipoEdad) { this.cantidadTipoEdad = cantidadTipoEdad; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public void setPromedioNota(Double promedioNota) { this.promedioNota = promedioNota; }
}
