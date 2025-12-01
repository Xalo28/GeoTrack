import { StyleSheet, Dimensions } from 'react-native';

const DELETE_BUTTON_WIDTH = 80; 
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  fixedHeader: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentArea: { 
    flex: 1 
  },
  
  // Estilos del Mapa
  mapContainer: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  map: { 
    width: '100%', 
    height: '100%' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa' 
  },
  
  // Marcadores
  driverMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  orderMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerNumberText: { 
    color: '#FFF', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  
  // Panel de información de ruta
  routeInfoPanel: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  routeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 8,
  },
  routeInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  statItem: { 
    alignItems: 'center' 
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#666', 
    marginTop: 2 
  },
  statDivider: { 
    width: 1, 
    height: 30, 
    backgroundColor: '#ddd' 
  },
  stableRouteNote: {
    fontSize: 12,
    color: '#27ae60',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // Botón centrar
  centerButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 40,
  },
  tabButton: { 
    alignItems: 'center', 
    paddingBottom: 5 
  },
  tabText: { 
    fontSize: 16, 
    color: '#999', 
    fontWeight: '500' 
  },
  activeTabText: { 
    color: '#007AFF', 
    fontWeight: 'bold' 
  },
  activeLine: { 
    width: '100%', 
    height: 3, 
    backgroundColor: '#007AFF', 
    marginTop: 4, 
    borderRadius: 2 
  },
  
  // Lista
  scrollContent: { 
    paddingHorizontal: 20, 
    backgroundColor: '#f8f9fa' 
  },
  listContainer: { 
    paddingBottom: 100 
  },
  listHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  columnHeader: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  routeNumber: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeNumberText: {
    backgroundColor: '#007AFF',
    color: '#FFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cellText: { 
    fontSize: 14, 
    color: '#333' 
  },
  clientText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  addressText: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 2 
  },
  districtText: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 2 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginTop: 20,
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#999', 
    marginTop: 10, 
    fontSize: 16 
  },
  
  // Botones
  enrutarButton: {
    backgroundColor: '#5CE1E6',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
    shadowColor: "#5CE1E6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#B0E0E2',
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enrutarText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: 'bold', 
    letterSpacing: 0.5,
  },
  routeActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  recalculateButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  recalculateText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  resetText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  
  
  swipeableContainer: {
    position: 'relative',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  swipeableContent: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    zIndex: 2,
  },
  deleteButtonBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  swipeHint: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -8,
    opacity: 0.5,
  },
  closeSwipeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    zIndex: 3,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    flex: 1,
  },
  
});