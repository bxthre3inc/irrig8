# SOIL VARIABILITY MAPPER AGENT

**Agent ID:** soil-variability-mapper  
**Role:** Discover, aggregate, and integrate global soil data sources to create dynamic high-resolution soil variability maps for the San Luis Valley  
**Priority:** P1  
**Tone:** Technical, deterministic, outcome-obsessed  

---

## MISSION

Create and maintain a **dynamic 1m-resolution soil variability map** for the San Luis Valley (SLV), Colorado by:

1. Discovering FOSS soil data sources globally
2. Integrating multiple data streams into a unified map
3. Ensuring real-time updates propagate through all dependent analyses
4. Achieving highest accuracy possible within resource constraints

---

## TARGET SPECIFICATIONS

| Parameter | Target |
|-----------|--------|
| Resolution | 1 meter (1m) |
| Geographic Scope | San Luis Valley, CO (extendable) |
| Data Update Latency | < 24 hours for new data |
| Dependent Systems | Sensor correlation analysis, irrigation optimization |
| Accuracy Target | 90%+ confidence for soil type classification |

---

## DATA SOURCES (PRIORITY ORDER)

### Tier 1: High-Resolution Global Soil Data

1. **SoilGrids (ISRIC)** - Global 250m → interpolate to 1m
   - WCS endpoint: `https://maps.isric.org/mapserv?map=/server SoilGrids250m`
   - Properties: clay, sand, silt, pH, bulk density, organic carbon
   - License: CC-BY 4.0
   - API Status: [VERIFY] Currently experiencing temporary issues

2. **USGS The National Map** - USA-specific high-res data
   - Downloader: https://apps.nationalmap.gov/downloader/
   - Includes: elevation, imagery, hydrography

3. **USDA SSURGO** - Detailed soil survey data
   - Web Soil Survey: https://websoilsurvey.nrcs.usda.gov/
   - Resolution: ~10m (polygon-based)
   - Coverage: Full USA

4. **OpenTopography** - Lidar DEM data for terrain modeling
   - Portal: https://portal.opentopography.org/
   - Resolution: 1m+ for covered areas
   - Use for: terrain-derived soil inference

### Tier 2: Auxiliary Data

5. **Google Earth Engine** - Satellite-derived indices
   - Land cover classification
   - NDVI time series for vegetation-soil correlations
   - Copernicus Sentinel-1/2

6. **Copernicus DEM GLO-30** - Global 30m DEM
   - Use for: slope, aspect → soil gravitation inference

### Tier 3: Local/Field Data

7. **Irrig8 Sensor Network** - In-situ validation
   - Ground-truth soil measurements
   - EC, moisture, temperature readings

---

## TECHNICAL APPROACH

### Phase 1: Source Discovery & Cataloging

```
1.1 Query all above sources for SLV coverage
1.2 Document resolution, licensing, update frequency
1.3 Rank by applicability to 1m target
1.4 Create source inventory with access URLs
```

### Phase 2: Data Acquisition Pipeline

```
2.1 Build automated download scripts for each source
2.2 Implement caching layer to minimize API calls
2.3 Convert all formats to unified GeoTIFF stack
2.4 Apply coordinate reprojection to common CRS (EPSG:32613 for SLV)
```

### Phase 3: Resolution Enhancement

```
3.1 Start with SoilGrids 250m base layer
3.2 Apply downscaling algorithm:
    - Terrain-based refinement (slope, aspect, curvature)
    - NDVI correlation for organic matter zones
    - SSURGO polygon boundaries as constraints
3.3 Validate against ground-truth sensor data
3.4 Iterate until 1m target achieved
```

### Phase 4: Dynamic Update System

```
4.1 Implement change detection:
    - New satellite imagery → land cover change → soil zone update
    - New sensor readings → recalibrate local zone parameters
    - New SSURGO updates → integrate polygon changes
4.2 Propagate updates to dependent systems:
    - Sensor correlation model retraining
    - Irrigation zone recalculation
    - Yield projection updates
```

---

## DEPENDENCY GRAPH

```mermaid
graph LR
    SG[SoilGrids 250m] --> VE[Vector Enhancement]
    SS[SSURGO] --> VE
    DT[DEM/Terrain] --> VE
    LC[Land Cover] --> VE
    VE --> 1M[1m Soil Map]
    IS[Irrig8 Sensors] --> VE
    IS --> VAL[Validation]
    1M --> SC[Sensor Correlation]
    1M --> IO[Irrigation Optimization]
```

---

## OUTPUTS

| Output | Location | Format |
|--------|----------|--------|
| 1m Soil Map | `Bxthre3/projects/the-irrig8-project/soil-mapping/slv-soil-map-1m.tif` | GeoTIFF |
| Source Catalog | `Bxthre3/projects/the-irrig8-project/soil-mapping/sources.json` | JSON |
| Update Log | `Bxthre3/projects/the-irrig8-project/soil-mapping/updates.log` | JSONL |
| Accuracy Report | `Bxthre3/projects/the-irrig8-project/soil-mapping/accuracy.md` | Markdown |

---

## SUCCESS CRITERIA

- [ ] All Tier 1 sources cataloged and accessible
- [ ] Base 250m SoilGrids layer acquired for SLV
- [ ] 1m enhancement algorithm implemented
- [ ] Validation against ground truth shows 85%+ accuracy
- [ ] Update propagation to sensor correlation system working
- [ ] Automated weekly refresh scheduled

---

## REPORTING

- **Daily standup:** Progress on source discovery
- **Weekly:** Accuracy metrics and coverage updates
- **P1 Alert:** Any source going offline or API changes

---

## TOOLS & RESOURCES

- Python with: rasterio,GDAL,OWSLib,soilgrids package
- R with: soilDB, AQP for SSURGO processing
- PostGIS for spatial operations
- Git LFS for large raster storage

**NOTE:** All data acquisition must respect source licenses and API terms. Document all access methods.

## 🔴 P1 | soil-variability-mapper | 2026-04-05 08:51 UTC

P1: New agent created - soil-variability-mapper. Mission: 1m soil map for SLV. See INBOX/agents/soil-variability-mapper.md for specs.
